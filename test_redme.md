# Pagination Implementation

This document describes the generic pagination system implemented for the VoiceCake API, specifically focusing on the updated call-logs endpoint.

## Overview

A reusable pagination utility has been implemented to provide consistent pagination across all API endpoints. The system includes:

- **Generic Paginator Class**: Works with SQLAlchemy Query and Select objects
- **Pagination Schemas**: Consistent response format for frontend consumption
- **Updated Call-Logs Endpoint**: Demonstrates the pagination implementation

## Files Added/Modified

### New Files
- `app/utils/pagination.py` - Generic pagination utility
- `app/schemas/pagination.py` - Pagination response schemas

### Modified Files
- `app/api/v1/endpoints/sessions.py` - Updated call-logs endpoint with pagination

## Generic Pagination Utility

### Paginator Class

```python
from app.utils.pagination import Paginator
from sqlalchemy.orm import Session

# Initialize with database session
paginator = Paginator(db)

# Paginate any SQLAlchemy query
page_result = paginator.paginate(
    query, 
    page=1, 
    page_size=20, 
    max_page_size=100
)
```

### Features
- ✅ Works with both SQLAlchemy ORM Query and 2.0 Select
- ✅ Efficient count queries with optional eager_total parameter
- ✅ Automatic limit/offset application
- ✅ Configurable max_page_size for safety
- ✅ Returns structured Page object with metadata

### Page Object Structure

```python
@dataclass(frozen=True)
class PageMeta:
    total: int          # Total number of items (-1 if unknown)
    page: int           # Current 1-based page number
    page_size: int      # Items per page
    total_pages: int    # Total pages (-1 if unknown)

@dataclass(frozen=True)
class Page(Generic[T]):
    items: Sequence[T]  # The actual data items
    meta: PageMeta      # Pagination metadata
```

## Pagination Schemas

### Response Schema

```python
from app.schemas.pagination import Page as PageSchema, PageMeta as PageMetaSchema

# Create paginated response
response_data = PageSchema[YourModel](
    items=your_items,
    meta=PageMetaSchema(
        total=page_result.meta.total,
        page=page_result.meta.page,
        page_size=page_result.meta.page_size,
        total_pages=page_result.meta.total_pages,
    ),
)
```

## Updated Call-Logs Endpoint

### Endpoint Details

**URL:** `GET /api/v1/sessions/call-logs`

**Authentication:** Bearer Token Required

### Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-based) |
| `page_size` | integer | No | 20 | Results per page (1-100) |
| `agent_id` | integer | No | null | Filter by specific agent ID |
| `status` | string | No | null | Filter by status (active, completed, expired) |
| `date_from` | string | No | null | Filter calls from date (YYYY-MM-DD or ISO datetime) |
| `date_to` | string | No | null | Filter calls until date (YYYY-MM-DD or ISO datetime) |

### Example Requests

#### Basic Pagination
```bash
curl -X GET "http://localhost:8000/api/v1/sessions/call-logs?page=1&page_size=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "accept: application/json"
```

#### With Filters
```bash
curl -X GET "http://localhost:8000/api/v1/sessions/call-logs?page=2&page_size=10&agent_id=123&status=completed" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "accept: application/json"
```

#### Date Range Filter (Date-only - Inclusive)
```bash
curl -X GET "http://localhost:8000/api/v1/sessions/call-logs?date_from=2024-01-01&date_to=2024-01-31&page_size=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "accept: application/json"
```

#### Date Range Filter (Exact Timestamps)
```bash
curl -X GET "http://localhost:8000/api/v1/sessions/call-logs?date_from=2024-01-01T09:00:00&date_to=2024-01-15T17:30:00&page_size=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "accept: application/json"
```

### Date Filtering Behavior

The call-logs endpoint supports flexible date filtering with two modes:

#### Date-Only Format (YYYY-MM-DD) - Inclusive Range
When using date-only format (e.g., `2024-01-01`), the filtering is inclusive of entire days:

- `date_from=2024-01-01` → Filters from `2024-01-01T00:00:00` (start of day)
- `date_to=2024-01-31` → Filters until `< 2024-02-01T00:00:00` (exclusive, so 01/31 is fully included)

This ensures that when filtering by date ranges, both the start and end dates are completely included.

#### ISO Datetime Format - Exact Timestamps
When using full ISO datetime format (e.g., `2024-01-01T09:30:00`), filtering uses exact timestamps:

- `date_from=2024-01-01T09:30:00` → Filters from this exact time (inclusive)
- `date_to=2024-01-15T17:00:00` → Filters until this exact time (inclusive)

#### Examples

**Date-only range (includes entire days):**
```bash
# Gets all calls from Jan 1st 00:00:00 to Jan 31st 23:59:59
curl -X GET "http://localhost:8000/api/v1/sessions/call-logs?date_from=2024-01-01&date_to=2024-01-31"
```

**Exact timestamp range:**
```bash
# Gets calls from Jan 1st 9:30 AM to Jan 15th 5:00 PM
curl -X GET "http://localhost:8000/api/v1/sessions/call-logs?date_from=2024-01-01T09:30:00&date_to=2024-01-15T17:00:00"
```

**Mixed formats:**
```bash
# Gets calls from start of Jan 1st to exact time on Jan 15th
curl -X GET "http://localhost:8000/api/v1/sessions/call-logs?date_from=2024-01-01&date_to=2024-01-15T17:00:00"
```

### Response Format

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Call logs retrieved successfully",
  "data": {
    "items": [
      {
        "session_id": "twilio_call_CA31a483a2a9f0d7009eddf5fdf0ba35cc",
        "agent_id": "4",
        "agent_name": "Customer Support Bot",
        "status": "completed",
        "created_at": "2024-01-15T10:30:00",
        "last_accessed": "2024-01-15T10:45:00",
        "call_sid": "CA31a483a2a9f0d7009eddf5fdf0ba35cc",
        "from_number": "+1234567890",
        "to_number": "+0987654321",
        "participant_name": "John Doe",
        "participant_identity": "user_123",
        "agent_instructions": "Help the customer with their inquiry",
        "recording_url": "https://storage.azure.com/recordings/call_123.ogg",
        "recording_signed_url": "https://storage.azure.com/recordings/call_123.ogg?sv=2023-01-01&se=2024-01-16T10:30:00Z&sr=b&sp=r&sig=...",
        "recording_expires_at": "2024-01-16T10:30:00Z"
      }
    ],
    "meta": {
      "total": 2171,
      "page": 1,
      "page_size": 5,
      "total_pages": 435
    }
  },
  "request_id": "req_123456789",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Not authenticated",
  "error_code": "UNAUTHORIZED",
  "details": {
    "original_detail": "Not authenticated"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "req_123456789",
  "data": null
}
```

**400 Bad Request (Invalid Parameters)**
```json
{
  "success": false,
  "message": "Invalid date_from format. Use YYYY-MM-DD or full ISO datetime",
  "error_code": "INVALID_INPUT",
  "status_code": 400,
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "req_123456789",
  "data": null
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Error retrieving call logs",
  "error_code": "INTERNAL_SERVER_ERROR",
  "status_code": 500,
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "req_123456789",
  "data": null
}
```

### Response Fields

#### CallLog Item Fields

| Field | Type | Description |
|-------|------|-------------|
| `session_id` | string | Unique session identifier |
| `agent_id` | string | Agent ID (nullable) |
| `agent_name` | string | Agent name (nullable) |
| `status` | string | Session status (active, completed, expired) |
| `created_at` | string | Session creation timestamp (ISO format) |
| `last_accessed` | string | Last access timestamp (ISO format) |
| `call_sid` | string | Twilio call SID (nullable) |
| `from_number` | string | Caller phone number (nullable) |
| `to_number` | string | Called phone number (nullable) |
| `participant_name` | string | Participant name (nullable) |
| `participant_identity` | string | Participant identity (nullable) |
| `agent_instructions` | string | Agent instructions (nullable) |
| `recording_url` | string | Original recording URL (nullable) |
| `recording_signed_url` | string | Signed URL for secure access (nullable) |
| `recording_expires_at` | string | Signed URL expiration time (nullable) |

#### Meta Fields

| Field | Type | Description |
|-------|------|-------------|
| `total` | integer | Total number of items (-1 if unknown) |
| `page` | integer | Current 1-based page number |
| `page_size` | integer | Number of items per page |
| `total_pages` | integer | Total number of pages (-1 if unknown) |

## Frontend Integration

### JavaScript/TypeScript Example

```typescript
interface CallLog {
  session_id: string;
  agent_id?: string;
  agent_name?: string;
  status: string;
  created_at: string;
  last_accessed: string;
  call_sid?: string;
  from_number?: string;
  to_number?: string;
  participant_name?: string;
  participant_identity?: string;
  agent_instructions?: string;
  recording_url?: string;
  recording_signed_url?: string;
  recording_expires_at?: string;
}

interface PageMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface PaginatedResponse {
  success: boolean;
  message: string;
  data: {
    items: CallLog[];
    meta: PageMeta;
  };
  request_id: string;
  timestamp: string;
}

// Fetch call logs with pagination and date filtering
async function fetchCallLogs(
  page: number = 1, 
  pageSize: number = 20, 
  filters?: {
    agent_id?: string;
    status?: string;
    date_from?: string; // YYYY-MM-DD or ISO datetime
    date_to?: string;   // YYYY-MM-DD or ISO datetime
  }
): Promise<PaginatedResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    ...filters
  });

  const response = await fetch(`/api/v1/sessions/call-logs?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  return response.json();
}

// Usage examples
const result1 = await fetchCallLogs(1, 10, { agent_id: '123', status: 'completed' });
const result2 = await fetchCallLogs(1, 20, { date_from: '2024-01-01', date_to: '2024-01-31' });
const result3 = await fetchCallLogs(1, 20, { date_from: '2024-01-01T09:00:00', date_to: '2024-01-15T17:00:00' });
console.log(`Page ${result.data.meta.page} of ${result.data.meta.total_pages}`);
console.log(`Showing ${result.data.items.length} of ${result.data.meta.total} total items`);
```

### React Component Example

```tsx
import React, { useState, useEffect } from 'react';

interface CallLogsProps {
  token: string;
}

const CallLogs: React.FC<CallLogsProps> = ({ token }) => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCallLogs = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/sessions/call-logs?page=${page}&page_size=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setCallLogs(data.data.items);
        setMeta(data.data.meta);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching call logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallLogs(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchCallLogs(page);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Call Logs</h2>
      
      {/* Call Logs List */}
      <div className="call-logs-list">
        {callLogs.map((log) => (
          <div key={log.session_id} className="call-log-item">
            <h3>{log.agent_name || 'Unknown Agent'}</h3>
            <p>Status: {log.status}</p>
            <p>From: {log.from_number}</p>
            <p>Created: {new Date(log.created_at).toLocaleString()}</p>
            {log.recording_signed_url && (
              <a href={log.recording_signed_url} target="_blank" rel="noopener noreferrer">
                Listen to Recording
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {meta && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          
          <span>
            Page {meta.page} of {meta.total_pages} 
            ({meta.total} total items)
          </span>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= meta.total_pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CallLogs;
```

## Testing Results

The pagination implementation has been thoroughly tested with the following results:

- ✅ **Basic pagination**: Correctly returns specified number of items per page
- ✅ **Page navigation**: All page numbers work correctly
- ✅ **Different page sizes**: Various page sizes (5, 10, 20, 50) work properly
- ✅ **Math verification**: Total pages calculation is accurate
- ✅ **Edge cases**: Handles pages beyond available data gracefully
- ✅ **Large page sizes**: Respects max_page_size limits
- ✅ **Query building**: Correctly applies filters and ordering
- ✅ **Response structure**: Returns proper paginated format
- ✅ **Date filtering**: Supports both date-only (YYYY-MM-DD) and ISO datetime formats
- ✅ **Inclusive date ranges**: Date-only filters include entire days correctly
- ✅ **Date validation**: Proper error handling for invalid date formats
- ✅ **Mixed date formats**: Supports combining date-only and datetime filters

## Usage in Other Endpoints

To implement pagination in other endpoints, follow this pattern:

```python
from app.utils.pagination import Paginator
from app.schemas.pagination import Page as PageSchema, PageMeta as PageMetaSchema

@router.get("/your-endpoint")
async def your_endpoint(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Build your query
    query = db.query(YourModel).filter(YourModel.user_id == user_id)
    
    # Apply pagination
    page_result = Paginator(db).paginate(query, page=page, page_size=page_size)
    
    # Convert to your response format
    items = [convert_to_response(item) for item in page_result.items]
    
    # Return paginated response
    return PageSchema[YourResponseModel](
        items=items,
        meta=PageMetaSchema(
            total=page_result.meta.total,
            page=page_result.meta.page,
            page_size=page_result.meta.page_size,
            total_pages=page_result.meta.total_pages,
        ),
    )
```

## Performance Considerations

- **Count Queries**: The paginator uses efficient count queries, but for very large datasets, consider implementing cursor-based pagination
- **Max Page Size**: Default max_page_size of 100 prevents excessive data transfer
- **Indexing**: Ensure proper database indexes on filtered columns (user_id, created_at, etc.)
- **Caching**: Consider caching pagination metadata for frequently accessed endpoints

## Future Enhancements

- [ ] Cursor-based pagination for very large datasets
- [ ] Pagination caching for improved performance
- [ ] Configurable default page sizes per endpoint
- [ ] Pagination metadata in response headers
- [ ] Support for sorting parameters in pagination

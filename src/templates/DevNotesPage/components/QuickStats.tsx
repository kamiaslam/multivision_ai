"use client";

import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Percentage from "@/components/Percentage";

interface QuickStatsProps {
  totalEndpoints: number;
  integrationGuidesCount: number;
  troubleshootingItemsCount: number;
  latestVersion: string;
}

const QuickStats = ({ 
  totalEndpoints, 
  integrationGuidesCount, 
  troubleshootingItemsCount, 
  latestVersion 
}: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-lg:overflow-hidden">
      <Card className="p-6 mb-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full">
            <Icon name="api" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sub-title-1">API Endpoints</div>
            </div>
            <div className="text-2xl font-bold text-t-primary">{totalEndpoints}</div>
            <div className="flex items-center gap-2 mt-1">
              <Percentage value={5.2} />
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 mb-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full">
            <Icon name="book" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sub-title-1">Integration Guides</div>
            </div>
            <div className="text-2xl font-bold text-t-primary">{integrationGuidesCount}</div>
            <div className="flex items-center gap-2 mt-1">
              <Percentage value={12.8} />
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 mb-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full">
            <Icon name="warning" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sub-title-1">Known Issues</div>
            </div>
            <div className="text-2xl font-bold text-t-primary">{troubleshootingItemsCount}</div>
            <div className="flex items-center gap-2 mt-1">
              <Percentage value={-3.1} />
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 mb-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full">
            <Icon name="version" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-sub-title-1">Latest Version</div>
            </div>
            <div className="text-2xl font-bold text-t-primary">{latestVersion}</div>
            <div className="flex items-center gap-2 mt-1">
              <Percentage value={0} />
              <span className="text-xs text-gray-500">released Jan 22</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickStats;

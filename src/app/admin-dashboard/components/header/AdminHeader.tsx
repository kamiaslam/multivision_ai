"use client";

import Button from "@/components/Button";
import { Bell, FileDown, Settings, User as UserIcon } from "lucide-react";
import { currentUser } from "../../utils/utils";
import { useCommonDialogs } from "../dialogs/commonDialogsContext";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import SearchGlobal from "@/components/Header/SearchGlobal";
import User from "@/components/Header/User";
import { useState } from "react";

interface AdminHeaderProps {
  activePage: string;
  hideSidebar?: boolean;
  onToggleSidebar?: () => void;
}
export function AdminHeader({ activePage, hideSidebar, onToggleSidebar }: AdminHeaderProps) {
  const { exportAllPagesPDFs, exportCurrentPagePDF } = useCommonDialogs();
  const [visibleSearch, setVisibleSearch] = useState(false);

  return (
    <header className="fixed top-0 right-0 z-20 bg-b-surface1 max-lg:!right-0 left-85 max-4xl:left-70 max-3xl:left-60 max-xl:left-0">
      <div className="flex items-center h-22 max-md:h-18 center-with-sidebar">
        <div className="mr-3 gap-3 max-md:mr-auto flex xl:hidden">
          <Logo />
          <Button
            className="flex-col gap-[4.5px] shrink-0 before:w-4.5 before:h-[1.5px] before:rounded-full before:bg-t-secondary before:transition-colors after:w-4.5 after:h-[1.5px] after:rounded-full after:bg-t-secondary after:transition-colors hover:before:bg-t-primary hover:after:bg-t-primary"
            onClick={onToggleSidebar}
            isCircle
            isWhite
          />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <SearchGlobal
            className="max-md:hidden"
            onClose={() => setVisibleSearch(false)}
            visible={visibleSearch}
          />
          <Button
            className="max-md:hidden"
            isBlack
            href="/add-agent"
            as="link"
          >
            Create
          </Button>
          <Button
            className="!hidden max-lg:!flex max-md:!hidden"
            isWhite
            isCircle
            onClick={() => setVisibleSearch(true)}
          >
            <Icon name="search" />
          </Button>
          <User />
        </div>
      </div>
    </header>
  );
}

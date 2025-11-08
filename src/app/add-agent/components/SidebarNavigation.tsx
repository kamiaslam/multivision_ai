import { Link } from "react-scroll";
import Search from "@/components/Search";
import Icon from "@/components/Icon";

interface NavigationItem {
  title: string;
  icon: string;
  description: string;
  to: string;
}

interface SidebarNavigationProps {
  navigation: NavigationItem[];
  isMountedRef: React.MutableRefObject<boolean>;
  scrollSpyEnabledRef: React.MutableRefObject<boolean>;
}

export const SidebarNavigation = ({
  navigation,
  isMountedRef,
  scrollSpyEnabledRef
}: SidebarNavigationProps) => {
  return (
    <div className="card sticky top-22 shrink-0 w-120 max-3xl:w-100 max-2xl:w-74 max-lg:hidden p-6">
      {/* <Search
        className="mb-3"
        value=""
        onChange={(e) => {}}
        placeholder="Search sections"
        isGray
      /> */}
      <div className="flex flex-col gap-1">
        {navigation.map((item, index) => (
          <Link
            className="group relative flex items-center h-18 px-3 cursor-pointer"
            activeClass="[&_.box-hover]:!visible [&_.box-hover]:!opacity-100"
            key={index}
            to={item.to}
            smooth={true}
            duration={500}
            isDynamic={true}
            spy={true}
            offset={-5.5}
            onSetActive={(to) => {
              try {
                // Only handle if component is still mounted and scroll spy is enabled
                if (isMountedRef.current && scrollSpyEnabledRef.current) {
                  console.log('Active section:', to);
                }
              } catch (error) {
                console.warn('Scroll spy active callback error:', error);
              }
            }}
            onSetInactive={(to) => {
              try {
                // Only handle if component is still mounted and scroll spy is enabled
                if (isMountedRef.current && scrollSpyEnabledRef.current) {
                  console.log('Inactive section:', to);
                }
              } catch (error) {
                console.warn('Scroll spy inactive callback error:', error);
              }
            }}
          >
            <div className="box-hover"></div>
            <div className="relative z-2 flex justify-center items-center shrink-0 !size-11 rounded-full bg-b-surface1">
              <Icon
                className="fill-t-secondary"
                name={item.icon}
              />
            </div>
            <div className="relative z-2 w-[calc(100%-2.75rem)] pl-4">
              <div className="text-button">{item.title}</div>
              <div className="mt-1 truncate text-caption text-t-secondary">
                {item.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

import Sidebar from "./Header/Sidebar";
import ActiveUsers from "./Header/ActiveUsers";

interface HeaderProps {
    onSave?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSave }: HeaderProps) => {
    return (
        <header className="bg-gray p-0 top-0" >
            <nav className="flex bg-gray items-center justify-between pt-3 lg:px-10" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Sidebar onSave={onSave} />
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <div className="relative">
                        Project Name: “Question will be inserted here”
                    </div>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <ActiveUsers />
                </div>
            </nav>
        </header>
    )
}

export default Header;
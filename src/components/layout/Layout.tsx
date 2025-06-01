import { Navbar } from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex h-screen flex-col bg-gray-100">
            <Navbar />
            <div className="mx-auto flex w-full grow px-4">
                <main className="mt-8 grow">{children}</main>
            </div>
            <Footer />
        </div>
    );
};

const Footer = () => {
    return <footer className="flex h-8 items-center justify-center bg-slate-500"></footer>;
};

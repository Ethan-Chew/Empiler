export default function Header({ title }) {
    return (
        <header className="z-10 min-w-screen p-10 shadow-md">
            <h1 className="font-bold text-3xl md:text-4xl">{ title }</h1>
        </header>
    )
}
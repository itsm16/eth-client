import { Spinner } from "./ui/spinner";


export default function Loader({ text = "Loading ..." }) {
    return (
        <div className="w-full h-full absolute flex justify-center items-center bg-black/50 backdrop-blur-sm border gap-2 z-90">
            <Spinner className="size-6" />
            <p>{text}</p>
        </div>
    )
}

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Hello World</h1>

      <Button>Click me</Button>
    </div>
  );
}

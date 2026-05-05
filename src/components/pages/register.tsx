import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/utils/query-functions";
import { LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {mutate: create, isPending} = useMutation({mutationFn : createUser, onSuccess: () => {
    navigate("/login")
    toast.success("User created successfully")
  }})

  const handleSubmit = async (e :any) => {
    e.preventDefault();
    create({name, email, password});
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <form action="" className="flex flex-col gap-3">
        <label className="text-sm" htmlFor="name">Name
          <Input id="name" className="mt-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="text-sm" htmlFor="email">Email
          <Input id="email" className="mt-1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="text-sm" htmlFor="password">Password
          <Input id="password" className="mt-1" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <Button onClick={handleSubmit} className="mt-5" disabled={isPending}>{isPending ? <LoaderCircle className="animate-spin"/> : "Register"}</Button>
      </form>
      <p className="mt-6">Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link></p>
    </div>
  )
}

import  { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/utils/query-functions";
import { useNavigate } from "react-router";
import useUserStore from "@/store/user-store";
import Loader from "../loader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {setUser} = useUserStore(state => state)
  const {mutate: login, isPending} = useMutation({mutationFn: loginUser, onSuccess: ({data}) => {
    setUser(data?.data)
    navigate("/")
  }, onSettled: () => {
    setLoading(false)
  }})
  const handleSubmit = (e : any) => {
    e.preventDefault();
    setLoading(true)
    login({email, password})
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <form action="" className="flex flex-col gap-4">
        <label className="text-sm" htmlFor="email">Email
          <Input id="email" className="mt-1" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
        </label>
        <label className="text-sm" htmlFor="password">Password
          <Input id="password" className="mt-1" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        </label>
        <Button onClick={handleSubmit} className="mt-5" disabled={isPending}>Login</Button>
      </form>
      {(isPending || loading) && <Loader />}
    </div>
  )
}

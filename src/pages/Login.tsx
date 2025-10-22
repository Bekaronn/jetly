import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Вход: ${email}, ${password}`);
  };

  return (
    <div className="flex justify-center my-20 px-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Войти
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Войти
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Нет аккаунта?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
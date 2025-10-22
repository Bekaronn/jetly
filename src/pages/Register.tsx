import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Пароли не совпадают!");
      return;
    }
    alert(`Регистрация: ${email}`);
  };

  return (
    <div className="flex justify-center my-20 px-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Регистрация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
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

            <div className="space-y-1">
              <Label htmlFor="confirm">Повторите пароль</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Повторите пароль"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Зарегистрироваться
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

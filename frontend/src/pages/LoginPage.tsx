// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Используем хук из контекста
import Spinner from "../components/Spinner";
import { Input } from "../components/Input";
import FormBlock from "../components/FormBlock";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Индикатор загрузки кнопки

  const { login, isAuthenticated, loading: authLoading } = useAuth(); // Получаем функцию входа из контекста
  const navigate = useNavigate();

  useEffect(() => {
    // Если проверка аутентификации завершена и пользователь аутентифицирован, перенаправляем его
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Очистить предыдущие ошибки
    setIsLoading(true); // Начать загрузку

    try {
      await login(email, password);
      // Перенаправление происходит внутри AuthContext.login при успехе
    } catch (err: unknown) {
      let message = "Ошибка входа";
      if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        message = (err as { message: string }).message;
      }
      setError(message); // Отобразить ошибку из контекста
    } finally {
      setIsLoading(false); // Завершить загрузку
    }
  };

  // Пока идет проверка токена, показываем спиннер, чтобы избежать мелькания формы
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-header-height-footer-height)] p-4">
      <FormBlock className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          Вход
        </h2>
        {error && (
          <div
            className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            label="Пароль"
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-24"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : "Войти"}
            </button>
            <Link
              to="/forgot-password"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
            >
              Забыли пароль?
            </Link>
          </div>
          <div className="text-center text-sm text-gray-700 dark:text-gray-200">
            Нет аккаунта?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
            >
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </FormBlock>
    </div>
  );
};

export default LoginPage;

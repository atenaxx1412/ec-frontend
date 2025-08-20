'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterFormData } from '@/types';

// バリデーションスキーマ
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, '姓を入力してください')
      .max(50, '姓は50文字以内で入力してください'),
    lastName: z
      .string()
      .min(1, '名を入力してください')
      .max(50, '名は50文字以内で入力してください'),
    email: z
      .string()
      .min(1, 'メールアドレスを入力してください')
      .email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(6, 'パスワードは6文字以上で入力してください')
      .max(128, 'パスワードは128文字以内で入力してください')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'パスワードは大文字・小文字・数字を含む必要があります'
      ),
    passwordConfirmation: z
      .string()
      .min(1, 'パスワード確認を入力してください'),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, '利用規約に同意してください'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirmation'],
  });

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

/**
 * ユーザー登録フォームコンポーネント
 */
export function RegisterForm({ onSuccess, redirectTo }: RegisterFormProps) {
  const { register: registerUser, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      agreeToTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerUser({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      password_confirmation: data.passwordConfirmation,
    });

    if (result.success) {
      reset();
      onSuccess?.();
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    }
  };

  // パスワード強度チェック
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = password ? getPasswordStrength(password) : 0;
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['とても弱い', '弱い', '普通', '強い', 'とても強い'];

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          新規アカウント作成
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          すでにアカウントをお持ちですか？{' '}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            ログイン
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* エラーメッセージ */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 姓名 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              姓
            </label>
            <div className="mt-1">
              <Input
                {...register('lastName')}
                type="text"
                placeholder="山田"
                error={errors.lastName?.message}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              名
            </label>
            <div className="mt-1">
              <Input
                {...register('firstName')}
                type="text"
                placeholder="太郎"
                error={errors.firstName?.message}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        </div>

        {/* メールアドレス */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <div className="mt-1">
            <Input
              {...register('email')}
              type="email"
              placeholder="example@email.com"
              error={errors.email?.message}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* パスワード */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            パスワード
          </label>
          <div className="mt-1 relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="パスワードを入力"
              error={errors.password?.message}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* パスワード強度インジケーター */}
          {password && (
            <div className="mt-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-full rounded-full ${
                      i < passwordStrength
                        ? strengthColors[passwordStrength - 1]
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                パスワード強度: {strengthLabels[passwordStrength - 1] || 'とても弱い'}
              </p>
            </div>
          )}
        </div>

        {/* パスワード確認 */}
        <div>
          <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
            パスワード確認
          </label>
          <div className="mt-1 relative">
            <Input
              {...register('passwordConfirmation')}
              type={showPasswordConfirmation ? 'text' : 'password'}
              placeholder="パスワードを再入力"
              error={errors.passwordConfirmation?.message}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
            >
              {showPasswordConfirmation ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 利用規約同意 */}
        <div className="flex items-start">
          <input
            {...register('agreeToTerms')}
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={isLoading}
          />
          <div className="ml-2">
            <label htmlFor="agreeToTerms" className="text-sm text-gray-900">
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                利用規約
              </Link>
              および
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                プライバシーポリシー
              </Link>
              に同意します
            </label>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600 mt-1">{errors.agreeToTerms.message}</p>
            )}
          </div>
        </div>

        {/* 登録ボタン */}
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'アカウント作成中...' : 'アカウントを作成'}
        </Button>
      </form>
    </div>
  );
}
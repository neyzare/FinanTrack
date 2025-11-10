import AuthForm from "@/app/components/authForm";
import { loginAction } from "@/app/data/action/authAction";

interface AuthProps {
    onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
    return <AuthForm onLogin={onLogin} action={loginAction} />;
}

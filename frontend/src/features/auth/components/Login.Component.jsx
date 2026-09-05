import Button from "@/shared/components/Button-Component.jsx";
import Input from "@/shared/components/Input-Component";

export default function Login({
    title = "Login",
    subtitle,
    onSubmit,
    email,
    onEmailChange,
    password,
    onPasswordChange,
    disabled,
}) {
    return (
    <div className="auth-container">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <Input name="Email" bType="email" pHolder="Enter your email" value={email} onChange={onEmailChange} />
            </div>
            <div className="form-group">
                <Input name="Password" bType="password" pHolder="Enter your password" value={password} onChange={onPasswordChange} />
            </div>
            <Button name="Login" cType="btn btn-primary" bType="submit" btnName="login" disabled={disabled} />
        </form>
    </div>
    )
}
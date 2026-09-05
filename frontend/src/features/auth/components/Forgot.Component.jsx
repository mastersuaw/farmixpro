import Button from "@/shared/components/Button-Component";
import Input from "@/shared/components/Input-Component";

export default function Forgot({title = "Forgot Password"}) {

    return (
        <div className="auth-container">
            <h2>{title}</h2>
            <form>
                <div className="form-group">
                    <Input name="Email" bType="email" pHolder="Enter your email" />
                </div>
                <Button name="Send Reset Link" cType="btn btn-primary" bType="submit" btnName="sendResetLink" />
            </form>
        </div>
    )
}
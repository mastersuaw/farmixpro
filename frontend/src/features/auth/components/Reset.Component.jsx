import Input from "@/shared/components/Input-Component.jsx";
import Button from "@/shared/components/Button-Component.jsx";

export default function Reset({title = "Reset Password"}) {
    return(
        <div className="auth-container">
            <h2>{title}</h2>
            <form>
                <div className="form-group">
                    <Input name="Password" bType="password" pHolder="Enter your new password" />
                </div>
                <div className="form-group">
                    <Input name="Confirm Password" bType="password" pHolder="Confirm your new password" />
                </div>
                <Button name="Reset Password" cType="btn btn-primary" bType="submit" btnName="resetPassword" />
            </form>
        </div>
    )
}
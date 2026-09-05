import logoPositive from "@/assets/logos/logo-horizontal-negro-hd.png";
import logoNegative from "@/assets/logos/logo-horizontal-blanco-hd.png";
import logoColor from "@/assets/logos/logo-horizontal-color-hd.png";

export default function Favicon({size, variant}) {
    
    const favicon = {
        color: logoColor,
        positive: logoPositive,
        negative: logoNegative
    };
    
    return (
        <div className={`favicon-container`}>
            <img
                className={`favicon-${size}`}
                src={favicon[variant]} 
                alt="Favicon" 
                />
        </div>
    )
}
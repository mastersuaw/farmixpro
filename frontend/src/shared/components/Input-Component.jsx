export default function Input({name, bType, pHolder, value, onChange, size="md"}){

    return(
        <div className={`input-container input-${size}`}>
            <label 
                htmlFor={name} 
                className="form-label">
                {name}
            </label>
            <input 
                id={name} 
                type={bType} 
                placeholder={pHolder} 
                value={value} 
                onChange={onChange}
                required/>
        </div>
    )
}
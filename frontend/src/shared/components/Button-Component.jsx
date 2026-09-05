export default function Button({name, cType, bType, btnName, disabled}){

    return(
        <button
            className={cType}
            type={bType}
            name={btnName}
            disabled={disabled}
            >{name}</button>
    )
}
export default function Button({name, cType, bType,btnName}){

    return(
        <button 
            className={cType} 
            type={bType}
            name={btnName}
            >{name}
        </button>
    )
}
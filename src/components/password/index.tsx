import React,{ useState, useMemo, useEffect } from 'react'
import classNames from 'classnames'
import styles from './styles.module.css'


interface PasswordInputProps {
    htmlType ?: 'password' | 'number' 
    length ?: number
    className ?: string
    onSubmit ?: (val:string) => void
}

const PasswordInput:React.FC<PasswordInputProps> = React.memo(({ length, className, htmlType, onSubmit }) => {
    const [ val, setVal ] = useState('')
    const [ foucs, setFoucs ] = useState(false)    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value)
    }

    useEffect(()=>{
        if(val.length === length && onSubmit){            
            onSubmit(val)
        }
    },[val, length, onSubmit])

    const offsetLeft = useMemo(()=>{
        if(!foucs){
            return { display:"none" }
        }
        if(val.length === length){
            return { left:(50 + 14) * ( length - 1  )}  
        }
        return { left:(50 + 14) * val.length }
    },[val, foucs, length])
    
    return (
        <div className={classNames(styles.password, className )}>
            <input                 
                onContextMenu={()=>false} 
                onPaste={()=>false} 
                onCopy={()=>false} 
                onCut ={()=>false} 
                autoComplete="off" 
                type={htmlType}  
                maxLength={length} 
                onFocus={() => {setFoucs(true)}} 
                onBlur={() => setFoucs(false)} 
                value={val} onChange={handleChange}
                />
            <div className={styles.box} style={offsetLeft}></div>
            {
                [ ...new Array(length).keys() ].map((i,idx)=>(<span key={idx}
                    className={classNames(styles.input,{
                        [ styles.active ] : foucs && val.length === idx
                    })}>
                    { (idx + 1) <= val.length && '*'  }
                </span>))
            }            
        </div>
    )
})

PasswordInput.defaultProps = {
    length:6,
    htmlType:"password"
}

export default PasswordInput
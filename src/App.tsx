import React, { useState } from 'react'
import classNames from 'classnames'
import Hashes from 'jshashes'
import { PassworInput } from '../src/components'
import styles from './App.module.css'

interface AppProps {

}

const SHA256 = "CPV5EptDwD/3NuF2E1AShpmJBHeTps0CXmIXhM+QHAA="

const HASHTYPES = [ 'MD5', 'SHA1', 'SHA256', 'SHA512', 'RMD160' ]

const GenForm:React.FC<any> = () => {
	const [ pwd, setPwd ] = useState('')
	const [ vals, setVals ] = useState({
		type:HASHTYPES[0],
		content:'',
		hmac:'',
		length:"4",
	})

	const handleFieldChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,field:string) => {
		e.persist()		
		setVals(c=>({ ...c, [field]:e.target.value }))
	}	

	const handleGen = () => {
		for(let [key, val] of Object.entries(vals)){
			if(!val){
				alert(key + ' 没有填写')
				return
			}
		}	
		const encrpty = new Hashes[vals.type]	
		const password = (encrpty.b64_hmac(vals.hmac,vals.content) as string).substring(2, parseInt(vals.length) + 2)  		
		setPwd(password)
	}

	const copy = () => {
        if (pwd === '') {
            return
        }
        const input = document.createElement('input')
        input.setAttribute('readonly', 'readonly')
        input.setAttribute('value', pwd)
        document.body.appendChild(input)
        input.setSelectionRange(0, 9999)
        input.select()
        if (document.execCommand('copy')) {
			document.execCommand('copy')
			alert('已复制到剪贴板!')
        }
        document.body.removeChild(input)
	}
	
	return <div className={styles.form}>
		<div className={styles.formItem}>
			<label>
				加密类型：
			</label>
			<span>
				<select value={ vals.type } onChange={e=>handleFieldChange(e,'type')}>
					{ HASHTYPES.map(t=>(<option key={t} value={t}>{t}</option>)) }
				</select>
			</span>
		</div>
		<div className={styles.formItem}>
			<label>
				内容：
			</label>
			<span>
				<input value={ vals.content } onChange={e=>handleFieldChange(e,'content')} type="text" placeholder="110@qq.com#1" />
			</span>
		</div>
		<div className={styles.formItem}>
			<label>
				HMAC：
			</label>
			<span>
				<input value={ vals.hmac } onChange={e=>handleFieldChange(e,'hmac')} type="password" placeholder="hmac"/>
			</span>
		</div>
		<div className={styles.formItem}>
			<label>
				长度：
			</label>
			<span>
				<input title={vals.length.toString()} value={ vals.length } onChange={e=>handleFieldChange(e,'length')} min={4} max={30} type="range"/>
			</span>
		</div>
		<div className={styles.formItem}>	
			<label></label>		
			<span>
				<button type="button" onClick={handleGen}>
					立即生成
				</button>
			</span>
		</div>
		{
			pwd && (
				<div className={styles.result}>
					<a href='#' title="点击复制" onClick={copy}>{ pwd }</a>
				</div>
			)	
		}		
	</div>
}

const App:React.FC<AppProps> = () => {		
	const [ offset, setOffset ] = useState(0)
	const handleGuard = (v:string) => {
		const guard = new Hashes.SHA256().b64_hmac(`${v}_iphone_password`,v)
		if(guard !== SHA256){
			setTimeout(()=>{
				alert('密码错误')
			},600)
		}else{
			setOffset(-40)
		}
	}

	return (
		<div className={styles.App}>
			<div className={styles.guard}>
				<div className={styles.left} style={offset ? { left: offset + 'vw' } : {}}></div>
				<div className={styles.right} style={offset ? { right: offset +'vw' } : {}}></div>
				<div className={classNames(styles.wrapper,{
						[ styles.show ] : offset
					})}>
					{ offset ? <GenForm /> : null	 }
				</div>
				{
					!offset ? <PassworInput onSubmit={handleGuard}/> : null
				}
				
			</div>
		</div>
	);
}

export default App;

import style from './publicLink.module.css'


export default function publicLink({url, title}){
    return(

     
            <a href={url} className={style.publicLinkContainer}>
                <div>
                {title}
                </div>
        
            </a>
  

    )
}
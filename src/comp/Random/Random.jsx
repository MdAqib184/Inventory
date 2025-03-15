import React, { useState } from 'react'
import './Random.css'
import meta_icns from '../asset/twtt.png'
import ref_icns from '../asset/ref.png'

const Random = () => { 

    let qts = [];
    async function loadQts () {
        const resp = await fetch("https://type.fit/api/quotes");
        qts = await resp.json();
    }
    
    const [quote,setQuote] = useState({
        text: "A house divided against itself cannot stand.",
        author: "Abraham Lincoln",
    });

    const random = ()=>{
        const slct = qts[Math.floor(Math.random()*qts.length)];
        setQuote(slct);
    }

    const mta = ()=> {
        window.open("https://twitter.com/intent/twit?text=")
    }

    loadQts();

  return (
    <div className='container'>
      <div className="quote">{quote.text}</div>
      <div className="line"></div>
      <div className="btm">
        <div className="athr">{quote.author.split(',')[0]}</div>
        <div className="icns">
            <img src={ref_icns} onClick={()=>{random()}} alt="" />
            <img src={meta_icns} onClick={()=>{mta()}} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Random

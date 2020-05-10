import React, {useState, useEffect} from 'react';
import { connect } from 'dva';
import styles from './IndexPage.scss';
import Bg from '../assets/bg.jpg'
import icon_logo from '../assets/icon_logo.png'
import success_logo from '../assets/success.png'



function IndexPage() {

  // 设置图片状态
  let [img, changeImg] = useState('');

  // 设置图片状态
  let [name, changeName] = useState('XXX');
  let [address, changeAddress] = useState('XXX');
  let [carno, changeCarno] = useState('XXX');


  // 设置日期状态
  let [date, changeDate] = useState([]);

  // 从本地存储读取图片
  useEffect(()=>{
    let img = window.localStorage.getItem('img'),
        name = window.localStorage.getItem('name'),
        address = window.localStorage.getItem('address'),
        carno = window.localStorage.getItem('carno');

    img && changeImg(img);
    name && changeName(name);
    address && changeAddress(address);
    carno && changeCarno(carno);
  }, []);

  // 实时更新时间
  useEffect(()=>{
    setInterval(()=>{
      let date = new Date();
      let year = String(date.getFullYear()).padStart(4, '0'),
          month = String(date.getMonth()+1).padStart(2, '0'),
          day = String(date.getDate()).padStart(2, '0'),
          hour = String(date.getHours()).padStart(2, '0'),
          min = String(date.getMinutes()).padStart(2, '0'),
          sec = String(date.getSeconds()).padStart(2, '0');

      changeDate([`${hour}:${min}:${sec}`, `${year}年${month}月${day}日`])
    }, 1000);
  }, []);

  let changePic = (e)=>{
    let file = e.target.files[0];
    console.log('file...', file, e);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(){
      console.log('result...', this.result);
      mergePic(this.result);
    }
  }

  let mergePic = (dataUrl)=>{
    let canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
    // 设置canvas的宽高
    canvas.width = 350;
    canvas.height = 460;

    // 绘制cnavas
    let img = new Image(), info = {};
    img.src = dataUrl;
    img.onload = function(){
      // 获取图片的宽高
      info.width = this.width;
      info.height = this.height;

      // 绘制人像
      if (info.width/info.height > 350/460){
        // 截取宽
        let drawWidth = info.height*(350/460),
            pos = (info.width - drawWidth)/2;
        context.drawImage(img, pos, 0, drawWidth, info.height, 0, 0, 350, 460);
      }else{
        // 截取高
        let drawHeight = info.width*(460/350),
          pos = (info.height - drawHeight)/2;
        context.drawImage(img, 0, pos, info.width, drawHeight, 0, 0, 350, 460);
      }

      // 加水印
      let strs = ['仅用于北京', '像素小区办', '理社区管理', '事项使用'];
      context.font = "20px serif";
      context.fillStyle = "#fff"
      context.fillText(strs[0], 235, 360);
      context.fillText(strs[1], 235, 382);
      context.fillText(strs[2], 235, 404);
      context.fillText(strs[3], 255, 426);

      let url = canvas.toDataURL();
      // 本地存储
      window.localStorage.setItem('img', url);
      changeImg(url);
    }
  }

  let editInfo = (type)=>{
    switch(type){
      case 'name':{
        let value = window.prompt('请输入你的姓名', 'XXX');
        if (value){
          window.localStorage.setItem('name', value);
          changeName(value);
        }
      } break;
      case 'address': {
        let value = window.prompt('请输入你的门牌号', 'XXX');
        if (value){
          window.localStorage.setItem('address', value);
          changeAddress(value);
        }
      } break;
      case 'carno': {
        let value = window.prompt('请输入你的车牌号', 'XXX');
        if (value){
          window.localStorage.setItem('carno', value);
          changeCarno(value);
        }
      } break;
      default: break;
    }
  }

  return (
    <div>
      {/* 背景图 */}
      <section className={styles.bg}>
        <img src={Bg} alt=""/>
      </section>

      {/* 头部 */}
      <section className={styles.header}>
        <img src={icon_logo} alt=""/>
        <p>北京像素</p>
      </section>

      {/* 图片 */}
      <section className={styles.canvas}>
        <section className={styles.upload}>
          <img src={img} alt=""/>
          <input type="file" onChange={changePic}/>
        </section>
        <p>姓名：
          <span onClick={()=>editInfo('name')}>{name}</span>
        </p>
        <p>楼门号：
          <span onClick={()=>editInfo('address')}>{address}</span>
        </p>
        <p>车辆信息：
          <span onClick={()=>editInfo('carno')}>{carno}</span>
        </p>
        <p>是否为房产所有人：
          <span>否(承租人)</span>
        </p>
      </section>

      {/* 计时 */}
      <section className={styles.time}>
        <img src={success_logo} alt=""/>
        <p>{date[0]}</p>
        <p>{date[1]}</p>
      </section>

      {/* 底部信息 */}
      <footer>
        <section>
          <button>添加幼儿或老人</button>
          <button>展示已绑定家属</button>
        </section>
        <p>提示：家中如有成员不能使用手机，请到北10-104进行办理</p>
        <p>北京像素治理中心电话：57572546/65725997</p>
        <p>平台技术支持电话：15311456117</p>
      </footer>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);

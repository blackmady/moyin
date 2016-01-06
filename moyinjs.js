
var AudioContext=AudioContext||webkitAudioContext;
var context=new AudioContext;
//调整兼容
//console.log(AudioContext);
navigator.getUserMedia=
  navigator.getUserMedia||
  navigator.webkitGetUserMedia||
  navigator.mozGetUserMedia;
//请求麦克风
navigator.getUserMedia({audio:true},function(e){
  var data,p=1;
  var source = context.createBufferSource();
source.playbackRate.value = 5;
  //从麦克风的输入流创建源节点
  var stream=context.createMediaStreamSource(e);
  //用于录音的processor节点
  var recorder=context.createScriptProcessor(1024);
  recorder.onaudioprocess=function(e){
    if(record.value=="停止"){//data.push(e.inputBuffer.getChannelData(0));
      var out0=e.outputBuffer.getChannelData(0);
  var in0=e.inputBuffer.getChannelData(0);//console.log(e.inputBuffer.getChannelData(0));
  for(var i=0;i<e.target.bufferSize;++i){
    //out0[i]=in0[i];
    data.push(in0[i]);}//console.log(i);
  }
  };

   function playvoice()// 回放音频
 {//console.log(data);
var wavedata = data;
var channels = 2;
// Create an empty two second stereo buffer at the
// sample rate of the AudioContext
var frameCount = wavedata.length; //采样长度;
var myArrayBuffer = context.createBuffer(channels, frameCount, context.sampleRate);
  for (var channel = 0; channel < channels; channel++) {
    // This gives us the actual array that contains the data
    var nowBuffering = myArrayBuffer.getChannelData(channel);
    for (var i = 0; i < wavedata.length; i++) {
      nowBuffering[i] = wavedata[i];
    }
  }
     var buf1 = context.createBufferSource();
    buf1.playbackRate.value = p;
    buf1.buffer = myArrayBuffer;
    
    buf1.connect(context.destination);
 buf1.start(0);
 
 
 }
  
  sv.onchange=function(){p= sv.value;}
  
  //录音/停止 按钮点击动作
  record.onclick=function(){
    
    if(record.value=="录音")
      return data=[],stream.connect(recorder),recorder.connect(context.destination),this.value="停止";
    if(record.value=="停止")
      return stream.disconnect(),recorder.disconnect(),this.value="录音";
  };

  //播放/停止 按钮点击动作
  play.onclick=function(){   
    if(this.value=="播放")
      return playvoice();

  };
  //保存
  save.onclick=function(){
    var frequency=context.sampleRate; //采样频率
    var pointSize=16; //采样点大小
    var channelNumber=1; //声道数量
    var blockSize=channelNumber*pointSize/8; //采样块大小
    var wave=[]; //数据
    var wavedata=[];
   
    for(var i=0;i<data.length;i++){
     
        wave.push(data[i]*0x8000|0);}
    
    var length=wave.length*pointSize/8; //数据长度
    var buffer=new Uint8Array(length+44); //wav文件数据
    var view=new DataView(buffer.buffer); //数据视图
    buffer.set(new Uint8Array([0x52,0x49,0x46,0x46])); //"RIFF"
    view.setUint32(4,data.length+44,true); //总长度
    buffer.set(new Uint8Array([0x57,0x41,0x56,0x45]),8); //"WAVE"
    buffer.set(new Uint8Array([0x66,0x6D,0x74,0x20]),12); //"fmt "
    view.setUint32(16,16,true); //WAV头大小
    view.setUint16(20,1,true); //编码方式
    view.setUint16(22,1,true); //声道数量
    view.setUint32(24,frequency,true); //采样频率
    view.setUint32(28,frequency*blockSize,true); //每秒字节数
    view.setUint16(32,blockSize,true); //采样块大小
    view.setUint16(34,pointSize,true); //采样点大小
    buffer.set(new Uint8Array([0x64,0x61,0x74,0x61]),36); //"data"
    view.setUint32(40,length,true); //数据长度
    buffer.set(new Uint8Array(new Int16Array(wave).buffer),44); //数据
    //打开文件
    var blob=new Blob([buffer],{type:"audio/wav"});
    open(URL.createObjectURL(blob));

    // Stereo

  }; 
},function(e){
  console.log("请求麦克风失败");
});
  
 


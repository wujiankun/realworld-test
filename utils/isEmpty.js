export default  (value)=>{
  if(!value) return true;
  return (String(value).trim()).length<=0;
}

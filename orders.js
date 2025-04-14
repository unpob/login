let orderData=[],deleteIndex=-1;async function fetchAndProcessCSV(){try{let e=await fetch("https://docs.google.com/spreadsheets/d/1_swkKr2v0lKZ4dAKq24bTcz6w1CXxbWs7xyCWwW2Cbo/gviz/tq?tqx=out:csv");if(!e.ok)throw Error(`HTTP error! status: ${e.status}`);let t=await e.text(),r=parseCSV(t);r.shift();orderData=r.slice(2).reverse().map((e,t)=>{let o=e[0]?formatDateTo12Hour(e[0]):"",s=r.length-1-t+2;return{orderDate:o,name:e[1]||`Unnamed_${s}`,phone:e[2]||"",status:e[3]||"pending",email:e[4]||"",address:e[5]||"",productCodes:e[6]||"",productCount:e[7]||"",totalCount:parseInt(e[8])||0,eachPrice:e[9]||"",shipping:parseFloat(e[10])||0,totalPrice:parseFloat(e[11])||0,discount:Math.abs(e[12])||0,excost:Math.abs(e[16])||0,pstatus:e[13]||"",orderid:e[14]||"error",originalIndex:s}}),generateUsersList(orderData)}catch(o){console.error("Error fetching or processing CSV:",o),alert("Failed to load order data. Please try again later.")}}function formatDateTo12Hour(e){let[t,r]=e.split(" "),[o,s,n]=t.split("/"),[a,d,i]=r.split(":");return`${o}/${s}/${n} ${a=a%12||12}:${d}:${i} ${a>=12?"PM":"AM"}`}function parseCSV(e){let t=[],r=e.trim().split("\n");for(let o of r){let s=[],n="",a=!1;for(let d=0;d<o.length;d++){let i=o[d],l=d>0?o[d-1]:"";if('"'===i&&"\\"!==l){a=!a;continue}","!==i||a?n+=i:(s.push(n.trim()),n="")}n&&s.push(n.trim()),t.push(s)}return t}function generateUsersList(e){let t=document.getElementById("usersList");if(!t){console.error("usersList element not found");return}t.innerHTML="",e.forEach((e,r)=>{let o=`

                    <div class="user-item">

                        <div class="user-details">

                            <div>

                                <h3>${e.name}</h3>

                                <p style="font-weight:600">OrderId: #${e.orderid}</p>

                                <p>Phone: <a style="text-decoration:none" href="tel:${e.phone}">${e.phone||"N/A"}</a></p>

                                <p>Status: <span class="status status-${e.status.toLowerCase().replace(/\s+/g,"")}">${e.status}</span></p>

                                <p>Payment: <span>${e.pstatus}</span></p>

                                <p>Order Date: ${e.orderDate||"N/A"}</p>

                            </div>

                            <div class="button-group">

                                <button class="view-btn" onclick="viewUser(${r})">View</button>

                                <button class="cancel-btn" onclick="showConfirmModal(${r})">Cancel</button>

                            </div>

                        </div>

                    </div>

                `;t.innerHTML+=o})}function viewUser(e){let t=orderData[e],r=new URLSearchParams({orderDate:t.orderDate,name:t.name,phone:t.phone,status:t.status,email:t.email,address:t.address,productCodes:t.productCodes,productCount:t.productCount,totalCount:t.totalCount,eachPrice:t.eachPrice,shipping:t.shipping,totalPrice:t.totalPrice,discount:t.discount,excost:t.excost,pstatus:t.pstatus,order:t.orderid,indexx:t.originalIndex}).toString();window.location.href=`morder.html?${r}`}function showConfirmModal(e){deleteIndex=e,document.getElementById("deleteUserName").textContent=orderData[e].name||"Unnamed User",document.getElementById("confirmModal").style.display="flex"}function closeConfirmModal(){document.getElementById("confirmModal").style.display="none"}async function confirmDelete(){if(!(deleteIndex<0)){document.getElementById("loading2").innerHTML='<div class="loader"></div>';try{await fetch("https://script.google.com/macros/s/AKfycbwAM-tsamZD8c_NgmMmXvrSy_QhbI3KIeMbYDaySL6TCsFD2b2GNjjhesniJvAYVlO7/exec",{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({sheetId:"1_swkKr2v0lKZ4dAKq24bTcz6w1CXxbWs7xyCWwW2Cbo",sheetName:"orders",action:"updateCell",row:orderData[deleteIndex].originalIndex,column:4,value:"Cancelled"})}),orderData[deleteIndex].status="Cancelled",generateUsersList(orderData),closeConfirmModal()}catch(e){console.error("Error deleting order:",e),alert("An error occurred while deleting the order")}finally{document.getElementById("loading2").innerHTML=""}}}function goBack(){window.history.back()}fetchAndProcessCSV();



const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(  {


    service:"hotmail",
    auth: {

        user: "createaniket@outlook.com",

        pass: "Aniket@007"
    }
})



const sendWelcomeMail = (email, name)=> {
   
const options = { 

    from: "createaniket@outlook.com",
    to:email,
    subject: "TRYING Email Sendings",
    text: `Welcome to our Task App Mr.${name}hope you are liking our App.`
}


transporter.sendMail(options, (error, info)=> {
    if(error){

        console.log(error)
        return
    }
    console.log(info.response)
})
}



// const sendCancelMail = (email, name) => {
//     const options = { 

//         from: "createaniket@outlook.com",
//         to:email,
//         subject: "Mail regarding user cancellation",
//         text: `hello  Mr.${name} please tell us why you are not with us?.`
        
//     }
//     transporter.sendMail(options, (error, info)=> {
//         if(error){
    
//             console.log(error)
//             return
//         }
//         console.log(info.response)
//     })
    
// }

module.exports = {
    sendWelcomeMail,
    // sendCancelMail

}
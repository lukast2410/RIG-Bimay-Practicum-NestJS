import axios from "axios";
import { async } from "rxjs";

const studentUrl = `https://laboratory.binus.ac.id/lapi/api/Binusmaya/Me`;
const astUrl = `https://laboratory.binus.ac.id/lapi/api/Account/Me`;

export const checkAstToken = async (auth) => {
  if(auth == undefined || auth == null || auth == ''){
      return null
  }else{
      const authRes = await axios.get(astUrl, {
          headers: {
              authorization: auth
          }
      }).then(res => res.data).catch(err => {return null})
      return authRes
  }
}

export const checkStudentToken = async (auth) =>{
  if(auth == undefined || auth == null || auth == ''){
      return null
  }else{
      const authRes = await axios.get(studentUrl, {
          headers: {
              authorization: auth
          }
      }).then(res => res.data).catch(err => {return null})
      return authRes
  }
}

export const checkCollabToken = async (auth) => {
  if(auth == undefined || auth == null || auth == ''){
      return null
  }else{
      let [authStudent, authAst] = await Promise.all([
          axios.get(studentUrl, {
              headers: {
                  authorization: auth
              }
          }).then(res => res.data).catch(err => {return null}),
          axios.get(astUrl, {
              headers: {
                  authorization: auth
              }
          }).then(res => res.data).catch(err => {return null})
      ])

      if(authStudent != null)
          return authStudent
      return authAst
  }
}
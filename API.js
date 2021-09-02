const fetch = require('node-fetch')

module.exports = {
    API: class{
        constructor(){
            console.log("New API constructor")
            this.api = "https://api.ecoledirecte.com/v3/";
        }

        async FetchLogin(username,password){
            return new Promise(async (resolve,reject) => {
                let body = "data={\"identifiant\": \"" + username + "\", \"motdepasse\": \"" + password + "\"}";
                fetch(this.api + '/login.awp',{method:'POST',body:body}).then(async data => {
                    data = await data.json();
                    if(data.code == 200){
                        resolve(data.token)
                    }
                    else if(data.message == 'Mot de passe invalide !'){
                        resolve(403)
                    }
                    else{
                        reject(data)
                    }
                })
            })
        }

        async FetchAccount(username,password){
            return new Promise(async (resolve,reject) => {
                let body = "data={\"identifiant\": \"" + username + "\", \"motdepasse\": \"" + password + "\"}";
                fetch(this.api + '/login.awp',{method:'POST',body:body}).then(async data => {
                    data = await data.json();
                    if(data.code == 200){
                        resolve(data.data.accounts)
                    }
                    else if(data.message == 'Mot de passe invalide !'){
                        resolve(403)
                    }
                    else{
                        reject(data)
                    }
                })
            })
        }

        async FetchNotes(token,accountID){
            console.time("TimerNotes")
            return new Promise(async (resolve,reject) => {
                let body = "data={\"token\": \"" + token + "\"}";
                fetch(this.api + '/eleves/'+accountID+'/notes.awp?verbe=get&',{method:'POST',body:body}).then(async data => {
                    data = await data.json();
                    if(data.code == 200){
                        console.timeEnd("TimerNotes")
                        resolve(data)
                    }
                    else{
                        reject(data)
                    }
                })
            })
        }

        async getStudentID(account){
            return account.id
        }

        async getClassId(account) {
            return account.profile.classe.id;
        }

    },

    main: async function (){
        let client = new this.API();

        let username = "Nom Prenom";
        let password = "password";

        let token = await client.FetchLogin(username,password)

        if(token == 403){
            console.log("Identifiants invalide")
            return;
        }
        
        let accounts = await client.FetchAccount(username,password)
        //console.log(accounts[0])

        //TODO VERIFY ACCOUNT
        let accountID = await client.getStudentID(accounts[0]);
        console.log("accountID: " + accountID)
        let notes = await client.FetchNotes(token,accountID)
        //console.log(notes.data.notes)
    }
}
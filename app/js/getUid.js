function getUid() {
    var userName = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var options = {
      url: 'https://api.handwrytten.com/v1/auth/authorization',
      method: 'GET',
      url_query:
        [
          {
            key: 'login',
            value: userName
          },
          {
            key: 'password',
            value: password
          }
        ]
    };
    ZFAPPS.request(options).then(function (response) {
      console.log(response);
      let body = JSON.parse(response.data.body);
      var uid = body.uid;
      setGlobalField(uid);
    }).catch(function (err) {
      console.log(err);
    }).finally(()=> {
        ZFAPPS.closeModal();
    });
  }
  
  function setGlobalField(uid) {
    var placeholder = 'vl__ugxtz_userid';
    var data = {
      name: "userId",
      description: "",
      data_type: "string",
      value: uid
    };
    var options = {
      url: 'https://books.zoho.com/api/v3/settings/orgvariables/' + placeholder,
      method: 'PUT',
      url_query: [
        {
          key: 'organization_id',
          value: orgID
        }],
      body: {
        mode: 'formdata',
        formdata: [
          {
            key: 'JSONString',
            value: JSON.stringify(data)
          }
        ]
      },
      connection_link_name: 'zohobooks'
    };
    ZFAPPS.request(options).then(function (value) {
      console.log("Success - " + value);
    }).catch(function (err) {
      console.log(err);
    });
  }
  
  function getGlobalFields() {
    var placeholder = 'vl__ugxtz_userid';
    var options = {
      url: 'https://books.zoho.com/api/v3/settings/orgvariables/' + placeholder,
      method: 'GET',
      url_query: [
        {
          key: 'organization_id',
          value: orgID
        }],
      connection_link_name: 'zohobooks'
    };
  
    ZFAPPS.request(options).then(function (value) {
        let body = JSON.parse(value.data.body);
        let uidResponse = body.orgvariable.value;
        console.log("Success - " + value);
        uid=uidResponse;
        return uid;
    }).catch(function (err) {
      console.log(err);
    });
  } 
window.uid =uid;
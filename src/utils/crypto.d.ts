declare namespace CryptoJS {
    namespace AES {
      function encrypt(str, key, options);
      function decrypt(str, key, options);
    }
    namespace enc {
      namespace Base64 {
        function parse(str);
      }
      let Utf8;
    }
    namespace mode {
      let CBC;
    }
    namespace pad {
      let Pkcs7;
    }
  }
  
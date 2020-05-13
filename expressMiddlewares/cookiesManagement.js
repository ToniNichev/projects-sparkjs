function cookiesManagement(req, res, next) {
  // example of adding/reading cookie
  var cookie = req.cookies.testCookie;
  if (cookie === undefined)
  {
    // no: set a new cookie
    var randomNumber = new Date().toDateString();
    res.cookie('testCookie',randomNumber, { maxAge: 900000, httpOnly: true });
    console.log('cookie created successfully');
  } 
  else
  {
    // cookie was already present 
    console.log('cookie exists', cookie);
  } 
  next(); // !Importat to continue execution.
}

export default cookiesManagement;
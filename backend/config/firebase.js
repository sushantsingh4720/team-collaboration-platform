const admin = require("firebase-admin");

// const serviceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
// };
const serviceAccount = {
  projectId: "realtime-team-collaboration",
  privateKey:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDqmhfRCWkCPg06\neqexA7I1NFuYJZWlWqjp2CaW7t/hM84GMjo6xSW8ViMXx+aSzqtJdDUpatY+CiTM\n7buRQKicllG28KwEEepKi38G8RfELhlhdt+a/GyhXoqaW3KZfezm4cSX2QB0KVfV\n/+L5vmSwmqSTk91/VkgnU5g/fwHC8VYLrJCYcJwRi3EZlVsBNPobrA688qsqk3e/\nlWkoSzTSYXJ+rjCBnROUzg3uFKOMPNZZBLVjL444C3Lbl4iWUBFRWDilff+zPK8M\nn35pPA1ztDvPep1qFtknVQRpM2EfjlBwiksZWciIPDXzRhtb+AtIg5I9Aklc38kk\nCqqvphjXAgMBAAECggEAJyTU6n0Od2BRJrvGdSOvvW7iBY3n3TI2UuZM8gwjcNkK\n/D+vNZUlibo5msMw9rfjHpt0L1fzLWDV6ReVn1PRjmcKdWLM4NT4ab3C0S6zD3m9\npGSIRLzvhzFWIRE3GuNG/vMWsVt01uz7CerrPU6GUG1NHo6ie5ey7FTnZ1jSu2rl\nXtP9SnZd0KsyQTMjY1Cn+s1tBzXphBKEiwAKXLUFuar1qtNgtULAqOKLjxN2uTgB\nw/dQ2I/onbGWCCVrmASwRpS2YLfs0BuL/FQOXxNZYQGSQhJyCLRUWwm8kjjoUhhj\nw31Jy1/1pEvZZCBwnuKgm6HazzQJ+CqoUVfkTBwGqQKBgQD/CmL7lTLSRZlyqWh7\n2ihkS/ftFDmy5Q5u28VL7Tzpxz96mbZLTiW0gxD4BD5v0T3FKihobS3boRH01kzY\nhaepU+7gvvNGcdqQC9UzwTC2gWCpoHyE/9n5anKLW//xXCxgQ1hBsvtOV+Uzpbb1\nUTBZEskQz4K4vvlfaK0SdpTrbQKBgQDrfAXx2bHalOHXkQkD/a5HTaVK9va2EMAW\nIOD2L9s5NiVs4nBbLYhSpYEkk97qahgSDMWqoamNADnbEADg9eRy3qZOhqqe2NIw\nDJyfqK7U9cTf2K7SsX4YhkO1Sgj6xy6T3ppxhEtNoa9MqDX1Vugz2rILOVGO4Ss0\n8J7xfUGG0wKBgEa/lt27cbGq5PpNzFIvHm1UNZ5qsebSa8KM7Jo3YWJoh093PH5/\nWy5L/XUPmFJkdQIww6zUPJhkghqtJ/wYd34dbnKiBdJQ2xSCc847lUvLcAkeH+y1\nHL53rPbDuqg1rYm2pND02YnOECLXoX1D3GmZMHWdWuHs+DhjTT+F7aGxAoGAeKeM\nODXNXeyIprXGQ8g4AoqzFWziTbjZYr0n5pvwnCi1FkwTO3Rh886fE8m8HqmLebwX\nj2zTfc5O1oIloR38FiskVPnE9CytzTa5DUkVg0IFxJe2Q3fz3sb0bC/p1+w0Xklh\nIqahGr6sHf/V3cXQpbj5Hq0Yr7eJNs/O8Ha4G0cCgYEAz4iYE717YCUSku33Qq/c\n0pLvfsVw1LE8KSGhLMdCTpkRQmD1+yc698qSwVut69g3T+hPABPDeAdoQXkJjdhO\n1C/bcovJ8Wd79myGgUPQHQnLc/Nd+txVneWY4p8+sPhiPlnKTn2Y+7DbPxXoDIj1\nfn4TpBNgGZvIv9AJgb7/QTw=\n-----END PRIVATE KEY-----\n".replace(
      /\\n/g,
      "\n"
    ),
  clientEmail:
    "firebase-adminsdk-fbsvc@realtime-team-collaboration.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

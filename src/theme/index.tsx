import { DefaultTheme } from 'styled-components';

export const theme:DefaultTheme = {
    red:"rgba(255,5,46,0.9)",
    black:{
        veryDark:"#141414",
        darker:"#181818",
        lighter:"#2F2F2F"
    },
    white:{
        lighter:"#fff",
        darker:"#e5e5e5"
    }
}

 // import original module declarations => in styled.d.ts
// import 'styled-components';

// // and extend them!
// declare module 'styled-components' {
//   export interface DefaultTheme {
//       red:string;
//       black:{
//           veryDark:string,
//           darker:string,
//           lighter:string
//       };
//       white:{
//           lighter:string,
//           darker:string
//       }
//   }
// }

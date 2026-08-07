// src/features/about/data/team.ts
//
// Ported from the Flutter app (insiit-ui/lib/screens/team.dart). Update as people
// join or leave — this is the only place the Team INSIIT screen reads from.

export interface TeamMember {
  name: string;
  email?: string;
  github?: string;
  /** Optional headshot URL. */
  imageUrl?: string;
}

export const MAINTAINERS: TeamMember[] = [
  // {
  //     name: "Anmol Kumar",
  //     email: "kumaranmol@iitgn.ac.in",
  //     github: "https://github.com/anmolkumr",
  //     imageUrl:
  //         "https://raw.githubusercontent.com/anmolkumr/insiit-ui/master/assets/anmol-insiit.jpg",
  // },
  // {
  //     name: "Mayank Gulati",
  //     email: "mayank.gulati@iitgn.ac.in",
  //     github: "https://github.com/mayankgul",
  //     imageUrl:
  //         "https://raw.githubusercontent.com/anmolkumr/insiit-ui/master/assets/mayank-insiit.jpeg",
  // },
];

export const CONTRIBUTORS: TeamMember[] = [
  // {
  //     name: "Aashmun Gupta",
  //     email: "aashmun.gupta@iitgn.ac.in",
  //     github: "https://github.com/AshStorm17",
  //     imageUrl:
  //         "https://raw.githubusercontent.com/anmolkumr/insiit-ui/master/assets/aashmun-insiit.jpeg",
  // },
  // {
  //     name: "Karan Gandhi",
  //     imageUrl:
  //         "https://raw.githubusercontent.com/anmolkumr/insiit-ui/master/assets/karan-insiit.jpeg",
  // },
];

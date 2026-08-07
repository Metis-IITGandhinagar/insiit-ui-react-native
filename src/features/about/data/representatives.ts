// src/features/about/data/representatives.ts
//
// Ported verbatim from the Flutter app (insiit-ui/lib/screens/representatives.dart).
//
// ⚠️ The student council changes every academic year, and these are personal contact
// details of named students. VERIFY THIS LIST before each release — shipping a stale
// council means students contact people who no longer hold the post.

export interface Representative {
  position: string;
  name: string;
  email?: string;
  mobile?: string;
}

export const STUDENT_COUNCIL: Representative[] = [
  // {
  //     position: "General Secretary",
  //     name: "Siddharth Sachin Doshi",
  //     mobile: "8208710144",
  //     email: "siddharth.doshi@iitgn.ac.in",
  // },
  // {
  //     position: "Convener, SS",
  //     name: "Shambhavi Agarwal",
  //     mobile: "9827948651",
  //     email: "shambhavi.agrawal@iitgn.ac.in",
  // },
  // {
  //     position: "Academic Secretary",
  //     name: "Shrishti Mishra",
  //     mobile: "9263870017",
  //     email: "shrishti.mishra@iitgn.ac.in",
  // },
  // {
  //     position: "Cultural Secretary",
  //     name: "Jovit Jayan",
  //     mobile: "9400907585",
  //     email: "jovit.jayan@iitgn.ac.in",
  // },
  // {
  //     position: "Technical Secretary",
  //     name: "Chandrabhan Patel",
  //     mobile: "6376471802",
  //     email: "chandrabhan.patel@iitgn.ac.in",
  // },
  // {
  //     position: "IR&P Secretary",
  //     name: "Rupak Banerjee",
  //     mobile: "9007669974",
  //     email: "rupak.banerjee@iitgn.ac.in",
  // },
  // {
  //     position: "PDC Secretary",
  //     name: "Mumuksh Anilkumar Jain",
  //     mobile: "8459610057",
  //     email: "mumuksh.jain@iitgn.ac.in",
  // },
  // {
  //     position: "Sports Secretary",
  //     name: "Keshav Sobania",
  //     mobile: "7240638176",
  //     email: "keshav.sobania@iitgn.ac.in",
  // },
  // {
  //     position: "Welfare Secretary",
  //     name: "Sridhar Singh Thakur",
  //     mobile: "6362578897",
  //     email: "sridharsingh.thakur@iitgn.ac.in",
  // },
];

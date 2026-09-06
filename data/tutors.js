/* ABC Tutoring — TUTOR DATA
   Dana: this is the ONLY file you need to edit to add, remove, or change a tutor.
   Edit, save, refresh the website. That is the whole process.
   "availability" is a normal weekly schedule — the site automatically projects it
   onto the next 21 days, so it never goes out of date.
   NOTE: the tutors below are SAMPLE DATA for the demo. Replace with your real tutors. */

window.ABC_DATA = {
  "subjects": [
    "Elementary Math",
    "Pre-Algebra",
    "Algebra I",
    "Algebra II",
    "Science",
    "Elementary Reading"
  ],
  "tutors": [
    {
      "id": "maya-r",
      "name": "Maya R.",
      "initials": "MR",
      "color": "#2F6F62",
      "blurb": "Patient with younger students and great at rebuilding confidence after a rough report card.",
      "subjects": [
        "Elementary Math",
        "Pre-Algebra"
      ],
      "gradeLow": 2,
      "gradeHigh": 7,
      "rate": 45,
      "mode": "Both",
      "availability": [
        {
          "day": "Tue",
          "times": [
            "16:00",
            "17:00"
          ]
        },
        {
          "day": "Thu",
          "times": [
            "16:00",
            "17:00"
          ]
        },
        {
          "day": "Sat",
          "times": [
            "09:00",
            "10:00"
          ]
        }
      ]
    },
    {
      "id": "daniel-k",
      "name": "Daniel K.",
      "initials": "DK",
      "color": "#3B6EA5",
      "blurb": "Focuses on showing your work and study habits that carry into high school.",
      "subjects": [
        "Pre-Algebra",
        "Algebra I"
      ],
      "gradeLow": 6,
      "gradeHigh": 9,
      "rate": 50,
      "mode": "Both",
      "availability": [
        {
          "day": "Mon",
          "times": [
            "17:00",
            "18:00",
            "19:00"
          ]
        },
        {
          "day": "Wed",
          "times": [
            "17:00",
            "18:00"
          ]
        }
      ]
    },
    {
      "id": "priya-s",
      "name": "Priya S.",
      "initials": "PS",
      "color": "#8A5FA8",
      "blurb": "Works through tough algebra units step by step, at the student's pace.",
      "subjects": [
        "Algebra I",
        "Algebra II"
      ],
      "gradeLow": 8,
      "gradeHigh": 11,
      "rate": 55,
      "mode": "Online",
      "availability": [
        {
          "day": "Tue",
          "times": [
            "18:00",
            "19:00"
          ]
        },
        {
          "day": "Sun",
          "times": [
            "13:00",
            "14:00"
          ]
        }
      ]
    },
    {
      "id": "marcus-t",
      "name": "Marcus T.",
      "initials": "MT",
      "color": "#B5613A",
      "blurb": "Algebra II specialist. Prepares students for end-of-unit tests and finals.",
      "subjects": [
        "Algebra II"
      ],
      "gradeLow": 9,
      "gradeHigh": 12,
      "rate": 60,
      "mode": "Both",
      "availability": [
        {
          "day": "Wed",
          "times": [
            "19:00"
          ]
        },
        {
          "day": "Sat",
          "times": [
            "11:00"
          ]
        }
      ]
    },
    {
      "id": "elena-v",
      "name": "Elena V.",
      "initials": "EV",
      "color": "#2E7D6B",
      "blurb": "Makes science click with hands-on explanations and real-world examples.",
      "subjects": [
        "Science"
      ],
      "gradeLow": 3,
      "gradeHigh": 8,
      "rate": 50,
      "mode": "Both",
      "availability": [
        {
          "day": "Mon",
          "times": [
            "16:00",
            "17:00"
          ]
        },
        {
          "day": "Thu",
          "times": [
            "18:00"
          ]
        }
      ]
    },
    {
      "id": "grace-l",
      "name": "Grace L.",
      "initials": "GL",
      "color": "#C08A2E",
      "blurb": "Early reading and phonics. Warm, encouraging, and very good with reluctant readers.",
      "subjects": [
        "Elementary Reading"
      ],
      "gradeLow": 0,
      "gradeHigh": 5,
      "rate": 45,
      "mode": "In-person",
      "availability": [
        {
          "day": "Tue",
          "times": [
            "15:00",
            "16:00"
          ]
        },
        {
          "day": "Thu",
          "times": [
            "15:00",
            "16:00"
          ]
        },
        {
          "day": "Sat",
          "times": [
            "10:00",
            "11:00"
          ]
        }
      ]
    }
  ]
};

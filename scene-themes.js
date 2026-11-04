// Teaching annotations for the original text in Act 1, Scene 4.
// Original and modern text remain in play-data.js. Expected lines guard each anchor.
window.SCENE_THEMES = {
  "scene": "Act 1, Scene 4",
  "annotations": [
    {
      "id": "torch-and-weight",
      "passageId": "p0186",
      "from": 0,
      "to": 1,
      "tone": "romeo",
      "theme": "Emotional vulnerability",
      "title": "He carries light but feels heavy.",
      "device": "Antithesis · wordplay",
      "text": "Romeo chooses to carry a torch rather than dance. The contrast between “heavy” and “light” turns his sadness into a physical weight: his romantic disappointment makes him withdraw from the celebration.",
      "keywords": [
        {
          "line": 0,
          "text": "not for this ambling"
        },
        {
          "line": 1,
          "text": "heavy"
        },
        {
          "line": 1,
          "text": "light"
        }
      ],
      "expected": [
        "Give me a torch. I am not for this ambling.",
        "Being but heavy, I will bear the light."
      ],
      "promptTitle": "Light and heavy",
      "meaning": "Romeo asks to carry a torch instead of dancing. He says that, although he feels heavy-hearted, he can carry the light.",
      "prompt": "Why might Shakespeare put “heavy” and “light” in the same line? What difference does Romeo draw between carrying light and feeling light-hearted?"
    },
    {
      "id": "soul-of-lead",
      "passageId": "p0188",
      "from": 0,
      "to": 2,
      "tone": "romeo",
      "theme": "Emotional vulnerability",
      "title": "Love seems to remove his freedom to act.",
      "device": "Metaphor · soles/soul pun",
      "text": "His friends have light dancing “soles”; Romeo has a “soul of lead”. The image of being fastened to the ground makes his melancholy seem paralysing. This prepares for his later sense of powerlessness before fate, although it does not itself prove a belief in destiny.",
      "keywords": [
        {
          "line": 1,
          "text": "soul of lead"
        },
        {
          "line": 2,
          "text": "cannot move"
        }
      ],
      "expected": [
        "Not I, believe me. You have dancing shoes",
        "With nimble soles. I have a soul of lead",
        "So stakes me to the ground I cannot move."
      ],
      "promptTitle": "Soles and soul",
      "meaning": "Romeo says his friends have light shoes for dancing, but his own soul feels like lead and keeps him fixed to the ground.",
      "prompt": "Why compare a soul to lead rather than simply say that Romeo is sad? What does “cannot move” suggest about how much control he feels he has?"
    },
    {
      "id": "cupids-wings",
      "passageId": "p0189",
      "from": 0,
      "to": 1,
      "tone": "mercutio",
      "theme": "A challenge to romantic melancholy",
      "title": "Mercutio answers heaviness with flight.",
      "device": "Classical allusion · contrast",
      "text": "Mercutio playfully suggests that Cupid’s wings should lift Romeo above ordinary limits. He uses a familiar romantic image to challenge Romeo’s self-pity; the joke is not evidence that Mercutio literally believes a god controls Romeo’s love.",
      "keywords": [
        {
          "line": 0,
          "text": "Cupid’s wings"
        },
        {
          "line": 1,
          "text": "soar"
        }
      ],
      "expected": [
        "You are a lover. Borrow Cupid’s wings",
        "And soar with them above a common bound."
      ],
      "promptTitle": "Try another image",
      "meaning": "Mercutio tells Romeo to borrow the wings of Cupid, the god of love, and jump higher than an ordinary person could.",
      "prompt": "How would Cupid’s wings change the image of Romeo’s “soul of lead”? Is Mercutio sympathising, challenging him, or doing both? Which words support your view?"
    },
    {
      "id": "wounded-by-love",
      "passageId": "p0190",
      "from": 0,
      "to": 3,
      "tone": "romeo",
      "theme": "Emotional vulnerability",
      "title": "Romeo presents himself as love’s wounded victim.",
      "device": "Cupid allusion · wound and burden imagery",
      "text": "Cupid’s arrow wounds rather than uplifts him. “Bound”, “woe”, “burden” and “sink” repeatedly make love restrictive and painful. Romeo describes himself as acted upon, preparing the scene’s later tension between outside forces and personal choice.",
      "keywords": [
        {
          "line": 0,
          "text": "sore enpiercèd"
        },
        {
          "line": 1,
          "text": "bound"
        },
        {
          "line": 3,
          "text": "love’s heavy burden"
        }
      ],
      "expected": [
        "I am too sore enpiercèd with his shaft",
        "To soar with his light feathers, and so bound,",
        "I cannot bound a pitch above dull woe.",
        "Under love’s heavy burden do I sink."
      ],
      "promptTitle": "Follow the movement",
      "meaning": "Romeo says Cupid’s arrow has hurt him too much to fly. He feels tied down by sadness and says that he sinks beneath love’s weight.",
      "prompt": "Trace the movement from the arrow to being “bound” and sinking. Who or what acts on whom? What pattern do you notice in the role Romeo gives himself?"
    },
    {
      "id": "tender-thing",
      "passageId": "p0191",
      "from": 0,
      "to": 1,
      "tone": "mercutio",
      "theme": "Anti-romantic humour",
      "title": "Mercutio turns suffering into a physical joke.",
      "device": "Bawdy wordplay · tonal contrast",
      "text": "Mercutio reverses the burden image: Romeo would burden love by sinking into it. The sexual suggestion undercuts Romeo’s solemn language and treats love as bodily experience rather than a grand, tragic power.",
      "keywords": [
        {
          "line": 0,
          "text": "burthen love"
        },
        {
          "line": 1,
          "text": "tender thing"
        }
      ],
      "expected": [
        "And to sink in it, should you burthen love—",
        "Too great oppression for a tender thing."
      ],
      "promptTitle": "Who carries the burden?",
      "meaning": "Mercutio turns Romeo’s image around: if Romeo sinks into love, Romeo will weigh love down, and love is too delicate to carry him.",
      "prompt": "Does Mercutio’s reply comfort Romeo, mock him, or do both? How does reversing the image of who carries the weight affect the serious tone?"
    },
    {
      "id": "thorn-of-love",
      "passageId": "p0192",
      "from": 0,
      "to": 1,
      "tone": "romeo",
      "theme": "Emotional vulnerability",
      "title": "Love is an aggressor, not a comfort.",
      "device": "Rhetorical question · simile · repetition",
      "text": "Romeo rejects the idea that love is “tender”. The repeated accusations and the thorn comparison make romantic feeling seem hostile and capable of hurting him. At this point he is still lovesick over Rosaline, not Juliet.",
      "keywords": [
        {
          "line": 0,
          "text": "too rough"
        },
        {
          "line": 1,
          "text": "pricks like thorn"
        }
      ],
      "expected": [
        "Is love a tender thing? It is too rough,",
        "Too rude, too boisterous, and it pricks like thorn."
      ],
      "promptTitle": "Question the description",
      "meaning": "Romeo asks whether love is really gentle. He describes it as rough, wild and painful, like a thorn that pricks him.",
      "prompt": "Why does Romeo question the word “tender”? What qualities does the thorn comparison give to love, and how might that view affect his response to it?"
    },
    {
      "id": "fight-back",
      "passageId": "p0193",
      "from": 0,
      "to": 1,
      "tone": "mercutio",
      "theme": "Agency versus passivity",
      "title": "Mercutio says Romeo can resist.",
      "device": "Imperatives · repetition · sexual pun",
      "text": "“Be rough” and “Prick love” tell Romeo to answer love’s aggression with his own. Mercutio’s joking advice assumes that Romeo can act and regain control, contrasting with Romeo’s presentation of himself as love’s helpless victim.",
      "keywords": [
        {
          "line": 0,
          "text": "be rough with love"
        },
        {
          "line": 1,
          "text": "beat love down"
        }
      ],
      "expected": [
        "If love be rough with you, be rough with love.",
        "Prick love for pricking, and you beat love down.—"
      ],
      "promptTitle": "Listen to the commands",
      "meaning": "Mercutio tells Romeo that if love hurts him, he should hurt it back and overpower it.",
      "prompt": "Which command verbs stand out? What response to being hurt do they encourage, and how does this differ from the response Romeo has described?"
    },
    {
      "id": "candle-holder",
      "passageId": "p0196",
      "from": 0,
      "to": 4,
      "tone": "romeo",
      "theme": "Romantic melancholy",
      "title": "Romeo chooses the role of an observer.",
      "device": "Light/heavy contrast · proverbial language",
      "text": "The dancers are “light of heart”; Romeo will hold a candle and watch. “I am done” signals defeat before the evening has properly begun. This supports the portrait of emotional withdrawal; it is background to fatalism rather than an explicit prediction of death.",
      "keywords": [
        {
          "line": 0,
          "text": "light of heart"
        },
        {
          "line": 3,
          "text": "look on"
        },
        {
          "line": 4,
          "text": "I am done"
        }
      ],
      "expected": [
        "A torch for me. Let wantons light of heart",
        "Tickle the senseless rushes with their heels.",
        "For I am proverbed with a grandsire phrase,",
        "I’ll be a candle holder, and look on.",
        "The game was ne'er so fair, and I am done."
      ],
      "promptTitle": "Inside or outside the action?",
      "meaning": "Romeo says the carefree people can dance while he holds a torch and watches. Even if the entertainment looks inviting, he says he is finished with the game.",
      "prompt": "What is striking about “I am done” before the evening has properly begun? What might choosing to watch rather than join in suggest about Romeo’s relation to the others?"
    },
    {
      "id": "love-as-mud",
      "passageId": "p0197",
      "from": 1,
      "to": 3,
      "tone": "mercutio",
      "theme": "An earthly view of love",
      "title": "His friends can pull him out of his mood.",
      "device": "Extended metaphor · comic deflation",
      "text": "Mercutio imagines Romeo stuck in mud and promises that the group will pull him free. Replacing exalted romantic suffering with a muddy predicament makes love seem ordinary and recoverable through friendship and action.",
      "keywords": [
        {
          "line": 1,
          "text": "draw thee from the mire"
        },
        {
          "line": 2,
          "text": "love, wherein thou stick’st"
        }
      ],
      "expected": [
        "If thou art dun, we’ll draw thee from the mire,",
        "Or—save your reverence—love, wherein thou stick’st",
        "Up to the ears. Come, we burn daylight, ho!"
      ],
      "promptTitle": "Picture the situation",
      "meaning": "Mercutio says the friends will pull Romeo free as if he were stuck in mud. He then calls that mud love and urges Romeo to get moving.",
      "prompt": "Does being pulled from the mud make Romeo’s situation seem permanent or changeable? Which part of the image leads you there, and how does that compare with Romeo’s own descriptions?"
    },
    {
      "id": "bad-idea",
      "passageId": "p0200",
      "from": 0,
      "to": 1,
      "tone": "fate",
      "theme": "Early foreboding",
      "title": "Good intentions do not reassure him.",
      "device": "Contrast · foreshadowing",
      "text": "Romeo accepts that they mean well but still feels that going to the masque is unwise. This is the first clear warning about attending the party in this exchange, leading into his reference to a dream and his closing premonition.",
      "keywords": [
        {
          "line": 0,
          "text": "mean well"
        },
        {
          "line": 1,
          "text": "no wit to go"
        }
      ],
      "expected": [
        "And we mean well in going to this mask,",
        "But ’tis no wit to go."
      ],
      "promptTitle": "Good intentions—and a doubt",
      "meaning": "Romeo says that they have good intentions in attending the masque, but he thinks it is not a wise idea to go.",
      "prompt": "Why might Romeo call the plan unwise even though they “mean well”? What is still unexplained, and what questions does his hesitation create for the audience?"
    },
    {
      "id": "romeos-dream",
      "passageId": "p0202",
      "from": 0,
      "to": 0,
      "tone": "fate",
      "theme": "A possible omen",
      "title": "A dream becomes a reason for hesitation.",
      "device": "Dream motif",
      "text": "Romeo offers his dream to explain why he doubts the visit. The scene never tells us exactly what he dreamed, so we should not invent its contents. Its importance is that he gives it weight when considering what may happen.",
      "keywords": [
        {
          "line": 0,
          "text": "dreamt a dream"
        }
      ],
      "expected": [
        "I dreamt a dream tonight."
      ],
      "promptTitle": "What counts as evidence?",
      "meaning": "Romeo says he had a dream the previous night. Here, “tonight” means last night; he does not tell us exactly what he dreamed.",
      "prompt": "What makes a dream relevant to Romeo’s decision about the party? What might the weight he gives it suggest about how he thinks the future can be known?"
    },
    {
      "id": "dreamers-lie",
      "passageId": "p0205",
      "from": 0,
      "to": 0,
      "tone": "mercutio",
      "theme": "Scepticism about dreams",
      "title": "Mercutio questions whether dreams tell the truth.",
      "device": "Pun on “lie”",
      "text": "“Lie” can mean being stretched out in bed or saying something untrue. Mercutio’s answer uses the second meaning to puncture the authority Romeo gives to dreams; Romeo then answers with the first.",
      "keywords": [
        {
          "line": 0,
          "text": "dreamers often lie"
        }
      ],
      "expected": [
        "That dreamers often lie."
      ],
      "promptTitle": "Hear the double meaning",
      "meaning": "Mercutio says that people who dream often “lie”. The word can mean telling an untruth or lying down.",
      "prompt": "Which meaning of “lie” seems to carry Mercutio’s main point? How does his joke challenge Romeo’s reason for hesitating?"
    },
    {
      "id": "dreams-true",
      "passageId": "p0206",
      "from": 0,
      "to": 0,
      "tone": "fate",
      "theme": "Dreams as meaningful signs",
      "title": "Romeo defends the possibility of true dreams.",
      "device": "Pun · verbal contrast",
      "text": "Romeo accepts that dreamers lie in bed but insists that what they dream can be true. This does not establish that every dream predicts the future; it shows his openness to meanings that Mercutio dismisses.",
      "keywords": [
        {
          "line": 0,
          "text": "dream things true"
        }
      ],
      "expected": [
        "In bed asleep while they do dream things true."
      ],
      "promptTitle": "Follow Romeo’s reply",
      "meaning": "Romeo replies that dreamers lie in bed while asleep, but the things they dream can still be true.",
      "prompt": "What would Romeo have to believe about dreams for this reply to support his hesitation? How does that differ from Mercutio’s position?"
    },
    {
      "id": "queen-mab",
      "passageId": "p0207",
      "from": 0,
      "to": 0,
      "tone": "mercutio",
      "theme": "Fantasy as a counterargument",
      "title": "A fairy story replaces Romeo’s serious omen.",
      "device": "Folkloric allusion · mock explanation",
      "text": "Mercutio offers Queen Mab as an extravagant explanation for Romeo’s dream. His imaginative performance sets up his later claim that dreams arise from fantasy. His scepticism is witty and theatrical, rather than a plain factual lecture.",
      "keywords": [
        {
          "line": 0,
          "text": "Queen Mab"
        }
      ],
      "expected": [
        "Oh, then, I see Queen Mab hath been with you."
      ],
      "promptTitle": "Why a fairy story?",
      "meaning": "Mercutio jokes that Queen Mab, a fairy associated here with dreams, must have visited Romeo as he slept.",
      "prompt": "Why might Mercutio introduce Queen Mab at this point? How does answering a serious concern with a fairy story change the tone of their disagreement?"
    },
    {
      "id": "dreams-and-desires",
      "passageId": "p0209",
      "from": 16,
      "to": 22,
      "tone": "mercutio",
      "theme": "Dreams mirror human desires",
      "title": "Love sits beside ambition and money.",
      "device": "Catalogue · parallelism · satire",
      "text": "Lovers dream of love, courtiers of courtly behaviour, lawyers of fees, and ladies of kisses. The parallel examples suggest that dreams reflect people’s preoccupations and appetites. Romantic passion becomes one ordinary desire among others, rather than a special message from the stars.",
      "keywords": [
        {
          "line": 17,
          "text": "lovers' brains"
        },
        {
          "line": 17,
          "text": "dream of love"
        },
        {
          "line": 19,
          "text": "dream on fees"
        },
        {
          "line": 20,
          "text": "kisses dream"
        }
      ],
      "expected": [
        "And in this state she gallops night by night",
        "Through lovers' brains, and then they dream of love;",
        "On courtiers' knees, that dream on curtsies straight;",
        "O'er lawyers' fingers, who straight dream on fees;",
        "O'er ladies' lips, who straight on kisses dream,",
        "Which oft the angry Mab with blisters plagues,",
        "Because their breaths with sweetmeats tainted are."
      ],
      "promptTitle": "Find the pattern",
      "meaning": "Mercutio describes lovers dreaming of love, courtiers of curtsies, lawyers of fees and ladies of kisses. He also imagines Mab blistering ladies’ lips when their breath is spoiled by sweets.",
      "prompt": "What does each person dream about? How do those dreams relate to their waking interests, and what might the pattern suggest about where romantic dreams come from?"
    },
    {
      "id": "disturbing-fantasy",
      "passageId": "p0209",
      "from": 28,
      "to": 34,
      "tone": "mercutio",
      "theme": "The limits of Mercutio’s “realism”",
      "title": "His imagination also becomes disturbing.",
      "device": "Violent imagery · tonal shift",
      "text": "The soldier’s dreams turn the fairy speech toward violence and fear. These images still reflect a dreamer’s life, not a confirmed prophecy. They also complicate the idea that Mercutio is simply a calm realist: he becomes absorbed in his own unsettling fantasy.",
      "keywords": [
        {
          "line": 29,
          "text": "cutting foreign throats"
        },
        {
          "line": 32,
          "text": "starts and wakes"
        },
        {
          "line": 33,
          "text": "frighted"
        }
      ],
      "expected": [
        "Sometime she driveth o'er a soldier’s neck,",
        "And then dreams he of cutting foreign throats,",
        "Of breaches, ambuscadoes, Spanish blades,",
        "Of healths five fathom deep, and then anon",
        "Drums in his ear, at which he starts and wakes,",
        "And being thus frighted swears a prayer or two",
        "And sleeps again. This is that very Mab"
      ],
      "promptTitle": "Notice the change in mood",
      "meaning": "Mab makes a soldier dream of fighting, weapons and enormous drinks. Imagined drums frighten him awake; he says a prayer or two and goes back to sleep.",
      "prompt": "How does the mood change from the lovers’ dreams to the soldier’s? What might these violent images make you question about calling Mercutio a straightforward “realist”?"
    },
    {
      "id": "talk-of-nothing",
      "passageId": "p0210",
      "from": 0,
      "to": 1,
      "tone": "mercutio",
      "theme": "Two attitudes to imagination",
      "title": "Romeo dismisses Mercutio’s fantasy.",
      "device": "Interruption · ironic contrast",
      "text": "Romeo cuts the speech short as “nothing”, even though he takes his own dream seriously. The contrast exposes their different ways of valuing imagination: Mercutio will turn Romeo’s criticism into an argument that all dreams lack substance.",
      "keywords": [
        {
          "line": 0,
          "text": "Peace, peace"
        },
        {
          "line": 1,
          "text": "nothing"
        }
      ],
      "expected": [
        "Peace, peace, Mercutio, peace!",
        "Thou talk’st of nothing."
      ],
      "promptTitle": "Why does Romeo interrupt?",
      "meaning": "Romeo tells Mercutio to stop speaking and says that his talk amounts to nothing.",
      "prompt": "Why does Romeo call this “nothing” after treating his own dream as worth discussing? What distinction might he be making between their two uses of imagination?"
    },
    {
      "id": "idle-brain",
      "passageId": "p0211",
      "from": 0,
      "to": 3,
      "tone": "mercutio",
      "theme": "Dreams are made by the mind",
      "title": "Mercutio locates dreams in the brain, not the stars.",
      "device": "Personification · parentage metaphor · simile",
      "text": "Dreams are the “children” of an inactive brain, born from “vain fantasy”. “Nothing” and the comparison with air deny them solid authority. This directly challenges Romeo’s willingness to treat a dream as a sign of what is coming.",
      "keywords": [
        {
          "line": 1,
          "text": "children of an idle brain"
        },
        {
          "line": 2,
          "text": "vain fantasy"
        },
        {
          "line": 3,
          "text": "thin of substance as the air"
        }
      ],
      "expected": [
        "True, I talk of dreams,",
        "Which are the children of an idle brain,",
        "Begot of nothing but vain fantasy,",
        "Which is as thin of substance as the air"
      ],
      "promptTitle": "Examine the family metaphor",
      "meaning": "Mercutio says dreams are born from an idle brain and empty imagination. He describes them as having no more solid substance than air.",
      "prompt": "If dreams are “children”, who or what are their parents? What effect do “nothing”, “vain” and the comparison with air have on the authority we give them?"
    },
    {
      "id": "inconstant-wind",
      "passageId": "p0211",
      "from": 4,
      "to": 7,
      "tone": "mercutio",
      "theme": "The unreliability of dreams",
      "title": "A changing wind cannot offer dependable guidance.",
      "device": "Personification · extended wind comparison",
      "text": "The wind is imagined as a changeable lover, wooing one direction and then turning to another. “Inconstant” makes fantasy seem unstable, weakening the claim that romantic dreams can reveal a fixed, reliable destiny.",
      "keywords": [
        {
          "line": 4,
          "text": "more inconstant than the wind"
        },
        {
          "line": 7,
          "text": "Turning his face"
        }
      ],
      "expected": [
        "And more inconstant than the wind, who woos",
        "Even now the frozen bosom of the north,",
        "And, being angered, puffs away from thence,",
        "Turning his face to the dew-dropping south."
      ],
      "promptTitle": "What sort of guide?",
      "meaning": "Mercutio compares fantasy to a wind that first courts the cold north, then grows angry and turns south.",
      "prompt": "Which qualities of the wind matter in this comparison? What sort of guide would it make dreams, and how does that view compare with Romeo’s?"
    },
    {
      "id": "late-or-early",
      "passageId": "p0212",
      "from": 0,
      "to": 1,
      "tone": "mercutio",
      "theme": "Practical time versus imagined destiny",
      "title": "Benvolio brings them back to the evening’s timetable.",
      "device": "Wind wordplay · contrast",
      "text": "Benvolio worries that they will arrive too late because supper is over. His practical concern sets up Romeo’s reply, “I fear too early”: Romeo is thinking beyond punctuality toward the consequences of entering the party.",
      "keywords": [
        {
          "line": 1,
          "text": "we shall come too late"
        }
      ],
      "expected": [
        "This wind you talk of, blows us from ourselves.",
        "Supper is done, and we shall come too late."
      ],
      "promptTitle": "Two ways of thinking about time",
      "meaning": "Benvolio says the talk is blowing them off course. Supper is over, and he worries they will arrive too late.",
      "prompt": "What different kinds of concern do “too late” and “too early” carry for Benvolio and Romeo? What change in scale or mood occurs between their lines?"
    },
    {
      "id": "hanging-in-stars",
      "passageId": "p0213",
      "from": 0,
      "to": 1,
      "tone": "fate",
      "theme": "Premonition of doom",
      "title": "Romeo imagines an outcome written in the stars.",
      "device": "Astrological imagery · foreshadowing",
      "text": "“My mind misgives” expresses an inward warning, while “hanging in the stars” places an unknown consequence beyond Romeo’s immediate control. He fears that the party is arriving too soon because it may start something dreadful. This is the scene’s clearest expression of fatalistic dread.",
      "keywords": [
        {
          "line": 0,
          "text": "I fear too early"
        },
        {
          "line": 0,
          "text": "my mind misgives"
        },
        {
          "line": 1,
          "text": "hanging in the stars"
        }
      ],
      "expected": [
        "I fear too early, for my mind misgives",
        "Some consequence yet hanging in the stars"
      ],
      "promptTitle": "Locate the source of the fear",
      "meaning": "Romeo fears arriving too early. He has an uneasy feeling that the stars hold some consequence in store that has not yet happened.",
      "prompt": "What do “my mind misgives” and “hanging in the stars” suggest about the source of Romeo’s fear? How much of the feared outcome seems to lie within his control?"
    },
    {
      "id": "revels-beginning",
      "passageId": "p0213",
      "from": 2,
      "to": 3,
      "tone": "fate",
      "theme": "The beginning of a tragic chain",
      "title": "Tonight’s celebration may start a fearful course of events.",
      "device": "Foreshadowing · celebration/danger contrast",
      "text": "Romeo links the beginning of the feared consequence to “this night’s revels”. A festive event is imagined as the starting point of a tragic sequence. The speech anticipates the plot; it does not prove that every later decision is unavoidable.",
      "keywords": [
        {
          "line": 2,
          "text": "begin his fearful date"
        },
        {
          "line": 3,
          "text": "this night’s revels"
        },
        {
          "line": 3,
          "text": "expire the term"
        }
      ],
      "expected": [
        "Shall bitterly begin his fearful date",
        "With this night’s revels, and expire the term"
      ],
      "promptTitle": "Link the present to the future",
      "meaning": "Romeo fears that the coming trouble will begin with tonight’s festivities and will bring the allotted span of his life to an end.",
      "prompt": "Which words connect future trouble to tonight’s celebration? How could the contrast between revels and a fearful beginning affect the audience’s expectations of the party?"
    },
    {
      "id": "untimely-death",
      "passageId": "p0213",
      "from": 4,
      "to": 5,
      "tone": "fate",
      "theme": "An anticipated premature death",
      "title": "The vague warning becomes a fear for his own life.",
      "device": "Death imagery · foreshadowing",
      "text": "“A despisèd life” suggests the low value Romeo places on his life in his present melancholy. “Forfeit” imagines that life being lost as a penalty, and “untimely death” makes the feared ending explicit. For an audience that heard the Prologue, the warning is especially ominous.",
      "keywords": [
        {
          "line": 4,
          "text": "despisèd life"
        },
        {
          "line": 5,
          "text": "vile forfeit"
        },
        {
          "line": 5,
          "text": "untimely death"
        }
      ],
      "expected": [
        "Of a despisèd life closed in my breast",
        "By some vile forfeit of untimely death."
      ],
      "promptTitle": "Make the warning more precise",
      "meaning": "Romeo fears that his unhappy life will be lost as a terrible penalty through death before its proper time.",
      "prompt": "How has the vague “consequence” become more specific? What might “despisèd” reveal about Romeo’s present mood, and how might hearing the Prologue affect the audience’s response?"
    },
    {
      "id": "steerage-and-choice",
      "passageId": "p0213",
      "from": 6,
      "to": 7,
      "tone": "fate",
      "theme": "Surrender to fate—and a choice to proceed",
      "title": "Another power steers, but Romeo still says “On”.",
      "device": "Extended nautical metaphor · tension between fate and agency",
      "text": "Romeo imagines his life as a ship directed by an unnamed helmsman, which may suggest God, Providence or fate. Asking that power to steer him expresses surrender. Yet “On” is also his decision to attend despite the warning, keeping fate and human choice in tension.",
      "keywords": [
        {
          "line": 6,
          "text": "steerage of my course"
        },
        {
          "line": 7,
          "text": "Direct my sail"
        },
        {
          "line": 7,
          "text": "On"
        }
      ],
      "expected": [
        "But he that hath the steerage of my course,",
        "Direct my sail. On, lusty gentlemen."
      ],
      "promptTitle": "Who directs the journey?",
      "meaning": "Romeo asks whoever controls the direction of his life to guide him as someone would guide a ship. He then tells his companions to go on.",
      "prompt": "In the sailing image, who seems to direct the journey? How does Romeo’s own word “On” complicate that picture? What larger question about directing your own life emerges here?"
    }
  ],
  "discussion": [
    {
      "id": "weight",
      "title": "Start with the image",
      "passageId": "p0188",
      "line": 1,
      "evidence": "Romeo: “soul of lead”",
      "question": "What would a soul made of lead feel like? How does that image explain Romeo’s refusal to dance, and what does it suggest about his emotional state?",
      "direction": "Lead is heavy, so the metaphor makes sadness seem paralysing. Connect it with “cannot move” and “love’s heavy burden”. Romeo feels constrained by his emotions; at this point he is still lovesick over Rosaline."
    },
    {
      "id": "respond",
      "title": "Compare their responses to love",
      "passageId": "p0193",
      "line": 0,
      "evidence": "Mercutio: “be rough with love”",
      "question": "Romeo says love hurts him. What does Mercutio tell him to do in response? Which character seems to believe he can take control, and which words support your view?",
      "direction": "Mercutio’s imperatives encourage resistance and action, while Romeo describes himself as wounded, bound and sinking. Students can infer a contrast between agency and passivity, while recognising Mercutio’s bawdy, joking tone."
    },
    {
      "id": "truth",
      "title": "Question the evidence of dreams",
      "passageId": "p0205",
      "line": 0,
      "evidence": "“dreamers often lie” / “dream things true”",
      "question": "What two meanings of “lie” shape the exchange? What does each character seem willing—or unwilling—to trust about dreams?",
      "direction": "Mercutio suggests dreams are untrue; Romeo answers that people lie in bed while dreaming things that may be true. The pun introduces opposing attitudes to dreams as meaningful signs. The scene does not reveal exactly what Romeo dreamed."
    },
    {
      "id": "desires",
      "title": "Look for the pattern in Queen Mab’s visits",
      "passageId": "p0209",
      "line": 17,
      "evidence": "“lovers’ brains” / lawyers dreaming of fees",
      "question": "Compare the lovers, courtiers and lawyers. How do their dreams relate to their everyday interests? What explanation for romantic dreams does this pattern suggest?",
      "direction": "Each group dreams about what it already wants or pursues. Mercutio’s catalogue makes romantic dreams seem like products of human appetite and preoccupation, rather than privileged messages about destiny."
    },
    {
      "id": "substance",
      "title": "Evaluate Mercutio’s language",
      "passageId": "p0211",
      "line": 1,
      "evidence": "“idle brain” / “vain fantasy” / air and wind",
      "question": "What do these descriptions have in common? How do they affect the authority of dreams? Is Mercutio’s elaborate fairy speech itself free from imagination?",
      "direction": "The language makes dreams seem insubstantial and unreliable. It supports Mercutio’s scepticism, but his own extravagant and sometimes disturbing imagery complicates the label “realist”. He uses fantasy to argue against trusting fantasy."
    },
    {
      "id": "consequences",
      "title": "Trace the feared chain of events",
      "passageId": "p0213",
      "line": 0,
      "evidence": "“I fear too early” to “untimely death”",
      "question": "Benvolio fears arriving too late; why does Romeo fear arriving too early? Trace the links between the stars, tonight’s revels and death. How might an audience that heard the Prologue respond?",
      "direction": "Romeo fears that entering the feast will begin a consequence associated with the stars and ending in premature death. The audience already knows the lovers will die, so the speech foreshadows the tragedy and gains dramatic irony."
    },
    {
      "id": "steering",
      "title": "Test the idea of control",
      "passageId": "p0213",
      "line": 6,
      "evidence": "“steerage of my course” / “Direct my sail” / “On”",
      "question": "Who seems to steer Romeo’s life in this image? Why is his next word, “On”, important? Does the passage show complete helplessness, a choice to accept risk, or a tension between the two?",
      "direction": "The unnamed helmsman suggests an external directing power, but Romeo still elects to continue. Accept different readings supported by the text. Distinguish Romeo’s belief in fate from a claim that the play proves every choice is predetermined."
    },
    {
      "id": "theme",
      "title": "Move from the contrast to a theme",
      "passageId": "p0213",
      "line": 1,
      "evidence": "Compare Romeo’s stars with Mercutio’s “idle brain”",
      "question": "Complete and defend this idea: “By contrasting Romeo’s ___ with Mercutio’s ___, Shakespeare explores whether love and our future are shaped by ___.” Use one short quotation from each character. What name could we give Romeo’s outlook?",
      "direction": "One possible inference is romantic fatalism: Romeo’s emotional vulnerability makes him receptive to the idea that love and destiny are governed by forces beyond his control. Mercutio instead locates dreams in human fantasy and desire. Strong responses preserve the unresolved tension between fate, interpretation and choice."
    }
  ]
};

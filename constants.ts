import React from 'react';
import PromptExample from './components/ui/PromptExample';

const Chapter1Content = () => (
  React.createElement(React.Fragment, null,
    React.createElement('p', null, 'Welcome to the forefront of cinematic creation. VEO 3, developed by Google DeepMind, represents the cutting edge of text-to-video AI generation. Unlike previous models, VEO 3 can generate up to 8 seconds of high-fidelity video with remarkable temporal consistency and physics understanding.'),
    React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Key Capabilities'),
    React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
      React.createElement('li', null, React.createElement('strong', null, 'Temporal Coherence:'), ' Maintains subject appearance and environmental consistency throughout the 8-second duration.'),
      React.createElement('li', null, React.createElement('strong', null, 'Physics Understanding:'), ' Interprets realistic motion, gravity, momentum, and material properties.'),
      React.createElement('li', null, React.createElement('strong', null, 'Cinematic Language:'), ' Responds to professional filmmaking terminology (dolly shots, crane movements, lighting setups).'),
      React.createElement('li', null, React.createElement('strong', null, 'Audio Generation:'), ' Creates synchronized soundscapes including dialogue, ambient sound, and music.')
    ),
    React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Why Structured Prompting Matters'),
    React.createElement('p', null, 'Vague descriptions lead to generic outputs because the model lacks context. A structured, professional prompt acts as a detailed blueprint for the AI, ensuring every element—from the subject\'s expression to the lighting\'s color temperature—is precisely controlled. The JSON prompt framework is the philosophy of treating AI video generation not as a guess, but as a digital cinematography process.')
  )
);
const chapter1Text = "Welcome to the forefront of cinematic creation. VEO 3, developed by Google DeepMind, represents the cutting edge of text-to-video AI generation. Unlike previous models, VEO 3 can generate up to 8 seconds of high-fidelity video with remarkable temporal consistency and physics understanding. Key Capabilities: Temporal Coherence: Maintains subject appearance and environmental consistency throughout the 8-second duration. Physics Understanding: Interprets realistic motion, gravity, momentum, and material properties. Cinematic Language: Responds to professional filmmaking terminology (dolly shots, crane movements, lighting setups). Audio Generation: Creates synchronized soundscapes including dialogue, ambient sound, and music. Why Structured Prompting Matters: Vague descriptions lead to generic outputs because the model lacks context. A structured, professional prompt acts as a detailed blueprint for the AI, ensuring every element—from the subject's expression to the lighting's color temperature—is precisely controlled. The JSON prompt framework is the philosophy of treating AI video generation not as a guess, but as a digital cinematography process.";

const Chapter2Content = () => (
  React.createElement(React.Fragment, null,
    React.createElement('p', null, 'The core of professional VEO 3 prompting is the 7-Component Professional Structure. This framework ensures every crucial aspect of a scene is defined, leaving nothing to chance.'),
    React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'The 7 Core Components'),
    React.createElement('ol', { className: "list-decimal list-inside space-y-2" },
      React.createElement('li', null, React.createElement('strong', null, 'Subject:'), ' Who or what the video is about. Requires extreme detail for consistency.'),
      React.createElement('li', null, React.createElement('strong', null, 'Action:'), ' What the subject is doing, grounded in realistic physics.'),
      React.createElement('li', null, React.createElement('strong', null, 'Scene:'), ' The environment, setting, and background. Establishes context.'),
      React.createElement('li', null, React.createElement('strong', null, 'Style:'), ' The overall aesthetic, mood, and cinematic references. Defines the look and feel.'),
      React.createElement('li', null, React.createElement('strong', null, 'Dialogue:'), ' Any spoken words, formatted correctly to control delivery and avoid subtitles.'),
      React.createElement('li', null, React.createElement('strong', null, 'Sounds:'), ' All non-dialogue audio, including ambient noise, sound effects, and music.'),
      React.createElement('li', null, React.createElement('strong', null, 'Technical (Negative Prompt):'), ' A quality control list of what should NOT appear in the video.')
    ),
    React.createElement('p', { className: "mt-4" }, 'Each section feeds into the next, creating a complete, holistic instruction set. Specificity is paramount; ambiguity in one section can lead to unpredictable results in the final output. Think of it as a screenplay, technical spec sheet, and director\'s notes all rolled into one.')
  )
);
const chapter2Text = "The core of professional VEO 3 prompting is the 7-Component Professional Structure. This framework ensures every crucial aspect of a scene is defined, leaving nothing to chance. The 7 Core Components are: 1. Subject: Who or what the video is about. 2. Action: What the subject is doing. 3. Scene: The environment and setting. 4. Style: The overall aesthetic and mood. 5. Dialogue: Any spoken words. 6. Sounds: All non-dialogue audio. 7. Technical (Negative Prompt): A quality control list of what should NOT appear. Each section feeds into the next, creating a complete, holistic instruction set. Specificity is paramount; ambiguity in one section can lead to unpredictable results in the final output. Think of it as a screenplay, technical spec sheet, and director's notes all rolled into one.";
  
const Chapter3Content = () => (
  React.createElement(React.Fragment, null,
    React.createElement('p', null, 'Understanding the language of cinematography is crucial for commanding VEO 3. The AI is trained on countless films and responds best to the established language of cinema.'),
    React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Camera Angles & Their Psychological Impact'),
    React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
      React.createElement('li', null, React.createElement('strong', null, 'Low-Angle Shot:'), ' Positioned below the subject, looking up. Makes the subject appear larger, more powerful, and dominant. Common in action films to elevate heroes.'),
      React.createElement('li', null, React.createElement('strong', null, 'High-Angle Shot:'), ' Looks down on a subject, diminishing their size and implying vulnerability, weakness, or entrapment. Often used in thrillers to suggest a character is being watched.'),
      React.createElement('li', null, React.createElement('strong', null, 'Dutch Angle (Canted Angle):'), ' The camera is tilted on its roll axis. Creates disorientation and psychological unease, communicating that the world is "off-kilter."'),
      React.createElement('li', null, React.createElement('strong', null, 'Eye-Level Shot:'), ' The most neutral angle, creating a sense of realism and direct connection with the subject.')
    ),
    React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Lens Selection Guide'),
    React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
      React.createElement('li', null, React.createElement('strong', null, 'Wide-Angle Lens (18mm-35mm):'), ' Captures a broad field of view and exaggerates depth. Can create a sense of vastness or, in interior spaces, a feeling of being trapped. Immerses the viewer in the environment.'),
      React.createElement('li', null, React.createElement('strong', null, 'Standard Lens (40mm-50mm):'), ' Closely replicates the perspective of the human eye. Offers a naturalistic, balanced, and observational quality.'),
      React.createElement('li', null, React.createElement('strong', null, 'Telephoto Lens (70mm+):'), ' Compresses space, making objects at different distances appear closer. Creates a shallow depth of field, isolating the subject. Can evoke a sense of surveillance or intimacy.')
    ),
    React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Camera Movement Vocabulary'),
    React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
      React.createElement('li', null, React.createElement('strong', null, 'Dolly Shot:'), ' The camera physically moves toward or away from a subject. A dolly-in increases emotional intensity, while a dolly-out can create a sense of finality.'),
      React.createElement('li', null, React.createElement('strong', null, 'Tracking Shot:'), ' The camera moves parallel to the subject, following the action. Creates a sense of participation and momentum.'),
      React.createElement('li', null, React.createElement('strong', null, 'Crane/Jib Shot:'), ' The camera moves vertically on an arm, creating sweeping, epic movements that can reveal scale or change perspective dramatically.'),
      React.createElement('li', null, React.createElement('strong', null, 'Handheld:'), ' Creates a sense of immediacy, realism, and sometimes chaos, as it mimics a human perspective.')
    )
  )
);
const chapter3Text = "Understanding the language of cinematography is crucial for commanding VEO 3. Camera Angles & Their Psychological Impact: A Low-Angle Shot makes the subject appear powerful. A High-Angle Shot implies vulnerability. A Dutch Angle creates unease. An Eye-Level Shot is neutral and realistic. Lens Selection Guide: A Wide-Angle Lens captures a broad field of view. A Standard Lens replicates the human eye's perspective. A Telephoto Lens compresses space and isolates the subject. Camera Movement Vocabulary: A Dolly Shot moves toward or away from a subject. A Tracking Shot moves parallel to the subject. A Crane Shot moves vertically, creating sweeping movements. Handheld creates a sense of immediacy and realism.";

const Chapter4Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'Beyond angles and lenses, shot configuration involves the art of composition and the technical details of motion. Mastering this allows you to guide the viewer\'s eye and establish a professional aesthetic.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Compositional Rules'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Rule of Thirds:'), ' Place key subjects or elements along invisible lines that divide the frame into thirds, or at their intersections. This creates a more balanced and visually interesting shot.'),
    React.createElement('li', null, React.createElement('strong', null, 'Leading Lines:'), ' Use natural lines in the environment (roads, fences, architecture) to draw the viewer\'s eye towards the subject.'),
    React.createElement('li', null, React.createElement('strong', null, 'Symmetry:'), ' Centering a subject can create a powerful sense of stability, formality, or intentional unease (a signature of Wes Anderson).')
  ),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Frame Rate (FPS)'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, '24 FPS:'), ' The cinematic standard. Creates a natural, film-like motion blur. Use this for most narrative content.'),
    React.createElement('li', null, React.createElement('strong', null, '60 FPS:'), ' Creates hyper-realistic, smooth motion. Ideal for slow-motion effects or action sequences where clarity is paramount. Prompting for "slow-motion" will often imply a higher frame rate.')
  ),
  React.createElement(PromptExample, {
    title: "Example Style Prompt",
    code: `"Style": "Low-angle tracking shot (that's where the camera is), following the subject from behind. The composition uses the rule of thirds, placing the character on the left third to create negative space on the right. 40mm lens for a naturalistic field of view. Shot at cinematic 24fps with subtle motion blur."`
  })
);
const chapter4Text = "Beyond angles and lenses, shot configuration involves composition and motion. Compositional Rules include the Rule of Thirds for balance, Leading Lines to guide the viewer's eye, and Symmetry for stability or unease. For Frame Rate, 24 FPS is the cinematic standard, creating film-like motion blur. 60 FPS creates hyper-realistic, smooth motion, ideal for slow-motion effects.";

const Chapter5Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'Character consistency is one of the biggest challenges in AI video. The 15-Attribute Minimum framework is a professional technique to combat this, providing VEO 3 with enough data to maintain a subject\'s appearance across multiple shots.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'The Attribute Checklist'),
  React.createElement('p', null, 'Your description should be a detailed casting call. Cover every aspect:'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2 mt-2' },
      React.createElement('li', null, 'Age, Ethnicity, Gender'),
      React.createElement('li', null, 'Hair (Color, Style, Length)'),
      React.createElement('li', null, 'Eyes (Color, Shape)'),
      React.createElement('li', null, 'Facial Features (e.g., sharp jawline, high cheekbones, light stubble)'),
      React.createElement('li', null, 'Build (e.g., athletic, slender, heavyset)'),
      React.createElement('li', null, 'Clothing (Top, Bottoms, Footwear, with material and color specifics)'),
      React.createElement('li', null, 'Accessories (e.g., watch, glasses, scars, tattoos)')
  ),
  React.createElement(PromptExample, {
    title: "Example Subject Prompt",
    code: `"Subject": "A 45-year-old Japanese male detective, lean athletic build, with short, slicked-back black hair showing hints of grey at the temples, sharp and weary brown eyes, a faint, pale scar above his left eyebrow, a strong jawline with 5 o'clock shadow, wearing a worn, dark brown leather trench coat (unbuttoned) over a slightly wrinkled white button-up shirt, charcoal grey wool slacks, and scuffed black leather oxford shoes."`
  })
);
const chapter5Text = "Character consistency is a major challenge. Use the 15-Attribute Minimum framework to maintain a subject's appearance. Your description should be a detailed casting call covering: Age, Ethnicity, Gender; Hair color, style, and length; Eye color and shape; Facial Features like jawline or stubble; Build, such as athletic or slender; Clothing, with material and color specifics; and Accessories, like a watch, glasses, or scars.";

const Chapter6Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'A scene is not just a location; it\'s an environment with depth, atmosphere, and a story of its own. Use a three-layer structure to build a rich and believable world.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'The 3-Layer Scene Structure'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Foreground:'), ' Elements closest to the camera. Can be used to frame the shot or add depth (e.g., a rain-streaked window pane, a flickering candle).'),
    React.createElement('li', null, React.createElement('strong', null, 'Mid-ground:'), ' Where the primary subject and action usually take place (e.g., the detective sitting at the diner counter).'),
    React.createElement('li', null, React.createElement('strong', null, 'Background:'), ' The world behind the subject. Adds context and scale (e.g., blurry city lights through the diner window, other patrons in soft focus).')
  ),
  React.createElement(PromptExample, {
    title: "Example Scene Prompt",
    code: `"Scene": "Interior of a dimly lit, 1940s-style American diner at 3 AM. Foreground: a half-empty, heavy ceramic coffee cup steams on the polished but worn wooden counter, a crumpled napkin beside it. Mid-ground: the detective sits alone on a red vinyl stool, hunched over his cup. Background: a large plate-glass window shows rain-slicked city streets. A buzzing red neon 'OPEN' sign glows outside, casting long, distorted shadows across the empty checkerboard floor and other vacant booths."`
  })
);
const chapter6Text = "A scene is an environment with depth and atmosphere. Use a three-layer structure to build a believable world. The Foreground consists of elements closest to the camera, used for framing or depth. The Mid-ground is where the primary subject and action occur. The Background is the world behind the subject, adding context and scale.";

const Chapter7Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'VEO 3 has a sophisticated understanding of physics. To get realistic motion, describe actions using keywords that relate to weight, momentum, and biomechanics.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Physics-Aware Keywords'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Weight & Momentum:'), ' Use words like "heavy," "sluggishly," "lumbers," "jerks," "drifts," "with great effort."'),
    React.createElement('li', null, React.createElement('strong', null, 'Biomechanics:'), ' Describe how the body moves. "He shifts his weight," "braces for impact," "recoils slightly," "subtle flinch."'),
    React.createElement('li', null, React.createElement('strong', null, 'Interaction:'), ' How does the action affect the environment? "Kicking up dust," "sending ripples through the water," "causing the stack of books to tremble."')
  ),
  React.createElement(PromptExample, {
    title: "Example Action Prompt",
    code: `"Action": "The detective slowly raises the heavy ceramic coffee cup to his lips, his movements sluggish and weighed down by exhaustion. His hand trembles almost imperceptibly, causing tiny ripples on the coffee's surface. He takes a slow, deliberate sip, his shoulders slumping forward as he lowers the cup, a sigh escaping him."`
  })
);
const chapter7Text = "To get realistic motion, describe actions using physics-aware keywords. For Weight & Momentum, use words like 'heavy,' 'sluggishly,' or 'with great effort.' For Biomechanics, describe body movements like 'shifts his weight' or 'braces for impact.' For Interaction, describe how the action affects the environment, such as 'kicking up dust' or 'sending ripples through the water.'";

const Chapter8Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'Lighting and color are your primary tools for conveying emotion and establishing a visual identity for your film.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Classic Lighting Setups'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Three-Point Lighting:'), ' The standard for creating a well-lit, dimensional subject. Consists of a Key Light (main), Fill Light (softens shadows), and Backlight (separates subject from background).'),
    React.createElement('li', null, React.createElement('strong', null, 'Rembrandt Lighting:'), ' Creates a small, inverted triangle of light on the subject\'s cheek. Known for its dramatic, moody, and painterly quality.'),
    React.createElement('li', null, React.createElement('strong', null, 'Chiaroscuro:'), ' Extreme contrast between light and dark, with deep shadows. A staple of Film Noir, creating mystery and tension.')
  ),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Professional Color Grades'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Teal & Orange:'), ' A popular blockbuster look. Pushes cool tones (shadows, skies) to teal and skin tones to orange, creating a vibrant, complementary contrast.'),
    React.createElement('li', null, React.createElement('strong', null, 'Desaturated/Bleach Bypass:'), ' Reduces color intensity, creating a gritty, grim, and realistic feel. Common in war films and dark thrillers.')
  ),
  React.createElement(PromptExample, {
    title: "Example Lighting & Color Prompt",
    code: `"Style": "...A single, harsh overhead lamp creates a dramatic Chiaroscuro lighting effect, illuminating the top of the subject's head and shoulders while plunging his face into deep, expressive shadows. The overall color grade is heavily desaturated, almost monochrome, with a cool blue tint in the shadows to enhance the melancholic, lonely atmosphere, reminiscent of a bleach bypass film process."`
  })
);
const chapter8Text = "Lighting and color convey emotion and visual identity. Classic Lighting Setups include Three-Point Lighting for a well-lit subject, Rembrandt Lighting for a dramatic, moody quality, and Chiaroscuro for extreme contrast. Professional Color Grades include the popular Teal & Orange for vibrant contrast, and Desaturated or Bleach Bypass for a gritty, realistic feel.";

const Chapter9Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'A silent video is a lifeless one. A detailed audio prompt is essential for immersion and to prevent the AI from generating distracting, nonsensical sounds.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'The Three Layers of Sound Design'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Ambient Sound:'), ' The background noise of the environment. What does the scene sound like? (e.g., "the low hum of a refrigerator," "distant city traffic," "wind rustling through leaves").'),
    React.createElement('li', null, React.createElement('strong', null, 'Sound Effects (SFX):'), ' Sounds directly caused by actions in the scene. Must be synchronized. (e.g., "the clink of the ceramic cup on the saucer," "the squeak of the vinyl booth," "a soft footstep").'),
    React.createElement('li', null, React.createElement('strong', null, 'Musical Score:'), ' The emotional layer. Specify genre, instrumentation, and mood. (e.g., "a melancholic, sparse piano score," "a tense, low-frequency synthesizer drone," "an epic orchestral swell").')
  ),
  React.createElement(PromptExample, {
    title: "Example Sound Prompt",
    code: `"Sounds": "Ambient soundscape: the persistent, gentle patter of rain tapping against the large diner window, mixed with the low, electric hum of the neon sign outside. Specific SFX: a sharp, clear clink as the heavy ceramic coffee cup is placed back on its saucer. Musical Score: a distant, lonely, and melancholic saxophone melody plays softly, as if from a far-off radio, full of reverb."`
  })
);
const chapter9Text = "A detailed audio prompt is essential for immersion. The Three Layers of Sound Design are: Ambient Sound, which is the background noise of the environment. Sound Effects (SFX), which are sounds directly caused by actions and must be synchronized. And Musical Score, the emotional layer where you specify genre, instrumentation, and mood.";

const Chapter10Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'VEO 3 can generate synchronized dialogue, but it requires a specific format to distinguish it from narration and avoid burnt-in subtitles.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'The Correct Dialogue Format'),
  React.createElement('p', null, 'Always use the character\'s name followed by a colon. This tells the AI who is speaking and that the words should be lip-synced.'),
  React.createElement('pre', { className: 'bg-gray-900 rounded p-3 text-sm my-2' }, React.createElement('code', null, '(Character Name): "Dialogue line here."')),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Specifying Delivery'),
  React.createElement('p', null, 'Don\'t just write the words; describe how they are spoken. Add parenthetical adverbs before the dialogue to guide the performance.'),
  React.createElement(PromptExample, {
    title: "Example Dialogue Prompt",
    code: `"Dialogue": "(spoken wearily, almost a whisper, in a low, gravelly voice) Detective Kaito: \\"I thought... I thought this case was closed.\\""`
  })
);
const chapter10Text = "VEO 3 can generate synchronized dialogue with a specific format. Always use the character's name followed by a colon, like this: (Character Name): \"Dialogue line here.\" To specify delivery, don't just write the words; describe how they are spoken. Add parenthetical adverbs before the dialogue to guide the AI's performance.";

const Chapter11Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'Transitions are the punctuation of film language. VEO 3 can create seamless and creative transitions that would be difficult or impossible with traditional cameras.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Cinematic Transitions'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Match Cut:'), ' A cut from one shot to another where the two shots are matched by the action or subject matter. (e.g., a spinning bone thrown in the air cuts to a spinning satellite in orbit).'),
    React.createElement('li', null, React.createElement('strong', null, 'Whip Pan:'), ' An extremely fast pan that blurs the image. Can be used to connect two different locations or times, creating a sense of frantic energy.'),
    React.createElement('li', null, React.createElement('strong', null, '"Impossible" Camera Movement:'), ' Prompt the camera to do things it can\'t in real life. (e.g., "The camera flies through the keyhole of a door," "The camera pulls back through solid walls to reveal the entire building.")')
  ),
  React.createElement(PromptExample, {
    title: "Example Impossible Transition Prompt",
    code: `"Style": "...The shot begins as a medium close-up. At the end of the 8-second clip, the camera executes an impossible dolly-in, pushing forward smoothly, passing through the character's eye pupil, which irises open to transition into a bright, overexposed memory sequence."`
  })
);
const chapter11Text = "VEO 3 can create seamless and creative transitions. Cinematic Transitions include the Match Cut, where two shots are matched by action or subject. The Whip Pan is an extremely fast pan that blurs the image, connecting locations or times. You can also prompt for \"Impossible\" Camera Movements, like flying through a keyhole or pulling back through solid walls.";

const Chapter12Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'Go beyond reality by prompting for visual effects. This allows you to create shots with a massive sense of scale and spectacle.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'VFX Prompting Techniques'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Particle Systems:'), ' Describe effects made of many small particles. (e.g., "glowing magical embers drift through the air," "a swirling vortex of sand," "sparks fly from the clashing swords.").'),
    React.createElement('li', null, React.createElement('strong', null, 'Time Manipulation:'), ' Use terms like "bullet-time," "slow-motion," "time-lapse," "frame ramping" to control the speed of action within the shot.'),
    React.createElement('li', null, React.createElement('strong', null, 'Surrealism:'), ' Explicitly ask for physics-defying visuals. (e.g., "buildings bend and warp as if made of rubber," "the character walks up a wall as gravity shifts.").')
  ),
  React.createElement(PromptExample, {
    title: "Example VFX Prompt",
    code: `"Action": "As the sorceress raises her hands, shimmering golden particle effects, like tiny embers, are drawn from the air and coalesce into a swirling sphere of energy between her palms. Simultaneously, the world around her slows to a dramatic bullet-time crawl; a falling leaf hangs suspended in mid-air, and ripples in a puddle freeze."`
  })
);
const chapter12Text = "Prompt for visual effects to create shots with scale and spectacle. VFX Prompting Techniques include Particle Systems, describing effects like 'glowing magical embers' or 'a swirling vortex of sand.' Use Time Manipulation with terms like 'bullet-time' or 'slow-motion' to control action speed. For Surrealism, explicitly ask for physics-defying visuals like 'buildings bend and warp.'";

const Chapter13Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'Adopting the conventions of a specific genre gives your video a recognizable and powerful visual identity.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Film Noir Strategy'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, 'Lighting: Chiaroscuro. Emphasize deep shadows and high-contrast key lights.'),
    React.createElement('li', null, 'Setting: Urban decay, rain-slicked streets, smoky interiors.'),
    React.createElement('li', null, 'Camera: Low angles, Dutch angles for paranoia, wide-angle lenses to create a sense of entrapment.')
  ),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Documentary Realism Strategy'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, 'Camera: Handheld, observational, slightly shaky to simulate a real cameraperson.'),
    React.createElement('li', null, 'Lighting: Natural, available light. Avoid dramatic, stylized setups.'),
    React.createElement('li', null, 'Lens: Standard (50mm) or slight zoom to create a sense of being there.')
  )
);
const chapter13Text = "Adopting genre conventions gives your video a powerful visual identity. For a Film Noir Strategy, use Chiaroscuro lighting, settings of urban decay, and low or Dutch camera angles. For a Documentary Realism Strategy, use a handheld, observational camera, natural lighting, and a standard 50mm lens to create a sense of being there.";

const Chapter14Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'Image inputs are a powerful tool for ensuring consistency and directing the AI. There are two main workflows:'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Image-to-Video (I2V)'),
  React.createElement('p', null, 'Provide a single image and describe the action. VEO 3 will animate the image based on your prompt.'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Best for:'), ' Bringing a still photograph or piece of concept art to life.'),
    React.createElement('li', null, React.createElement('strong', null, 'Prompt Focus:'), ' Your prompt should focus on the ACTION, as the visual style is already defined by the image. e.g., "The man in the photo slowly turns his head towards the camera and smiles."')
  ),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Start/End Frame'),
  React.createElement('p', null, 'Provide a starting image and an ending image. VEO 3 will generate the video that transitions between the two.'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Best for:'), ' Precise control over a transformation or character movement across the frame.'),
    React.createElement('li', null, React.createElement('strong', null, 'Prompt Focus:'), ' The prompt can be more minimal, as the start and end points are locked. Focus on the STYLE of the transition. e.g., "A smooth dolly zoom that transitions from the start to the end frame."')
  )
);
const chapter14Text = "Image inputs are a powerful tool for consistency. The Image-to-Video workflow animates a single image based on your prompt, which should focus on the action. The Start/End Frame workflow generates a video that transitions between two provided images. This is best for precise control over transformations, and your prompt should focus on the style of the transition.";

const Chapter15Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'Quality control is key. Your "Technical" or "Negative Prompt" section is where you list everything you DON\'T want to see. This helps refine the output and avoid common AI artifacts.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Essential Negative Prompts'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Anatomy:'), ' "mangled hands, distorted faces, extra limbs, fused fingers, poor anatomy"'),
    React.createElement('li', null, React.createElement('strong', null, 'Physics:'), ' "floating objects, clipping, unnatural motion, weightless, objects passing through each other"'),
    React.createElement('li', null, React.createElement('strong', null, 'Visual Quality:'), ' "blurry, low-resolution, watermark, text, signature, grainy, jpeg artifacts, ugly"'),
    React.createElement('li', null, React.createElement('strong', null, 'Composition:'), ' "poorly framed, bad composition, subject out of frame, cropped head"')
  ),
  React.createElement('h4', { className: "text-xl mt-4 mb-2" }, 'Pro Tip:'),
  React.createElement('p', null, 'Keep a running list of your most effective negative prompts and reuse them as a base for all your projects.')
);
const chapter15Text = "Quality control is key. Use the 'Technical' or 'Negative Prompt' section to list what you don't want. Essential negative prompts for Anatomy include 'mangled hands' and 'distorted faces.' For Physics, use 'floating objects' and 'unnatural motion.' For Visual Quality, include 'blurry' and 'watermark.' For Composition, use 'poorly framed' and 'bad composition.' Keep a running list of your most effective negative prompts.";

const Chapter16Content = () => {
  const sciFiPrompt = {
    "veo3_prompt": {
      "Subject": "A 30-year-old female astronaut, Hispanic, with determined brown eyes, dark hair tied in a tight bun, wearing a detailed white and orange spacesuit with a NASA patch, her face lightly smudged with grease.",
      "Action": "She carefully pulls a lever with a gloved hand, her entire body tensing with the effort. Sparks erupt from the console as the lever locks into place with a heavy, satisfying clunk. She exhales a visible cloud of breath in the cold air.",
      "Scene": "Interior of a cramped, futuristic spaceship cockpit. Foreground: a blurry computer monitor displays scrolling red alert text. Mid-ground: the astronaut and the control console. Background: through the cockpit window, the swirling clouds of Jupiter are visible.",
      "Style": "Medium close-up shot, handheld with a slight, realistic shake, 35mm lens. Lighting is harsh and practical, coming from the console's screens, casting a blue and orange glow on her face. Color grade is desaturated with high contrast, inspired by 'Blade Runner 2049'.",
      "Dialogue": "(through comms, strained) Captain Eva: \"Main thruster engaged. Brace for ignition.\"",
      "Sounds": "Ambient sound of the ship's low-frequency humming and computer beeps. SFX: loud electrical crackle of sparks, the metallic screech and final thud of the lever. Score: a tense, low-pitched synthesizer drone that builds in intensity.",
      "Technical": "Negative prompt: mangled hands, distorted face, extra limbs, floating objects, clipping, blurry, low-resolution, watermark, text, signature, poorly framed."
    },
    "style_references": ["Blade Runner 2049", "Gravity (2013)"],
    "technical_specifications": "1080p, 24fps, 16:9 aspect ratio",
    "production_parameters": "Generate an 8-second clip.",
    "narrative_summary": "An astronaut engages the main thruster of her ship, with Jupiter visible outside."
  };
  
  const fantasyPrompt = {
    "veo3_prompt": {
        "Subject": "An ancient, colossal dragon, scales the color of obsidian and volcanic rock, with molten gold eyes that glow with immense power. Its horns are twisted and jagged like mountain peaks, and smoke gently curls from its nostrils. It has a powerful, serpentine body, vast leathery wings, and a scar running across its snout.",
        "Action": "The dragon unfurls its massive wings with a slow, powerful motion that stirs up loose rocks and dust. It lowers its head, sniffs the air with a deep, rumbling growl that vibrates through the ground, and fixes its glowing eyes on something unseen in the distance.",
        "Scene": "A narrow, treacherous mountain pass at dusk. Foreground: sharp, snow-dusted rocks frame the shot. Mid-ground: The dragon is perched on a rocky outcrop. Background: jagged, towering mountain peaks disappear into a dramatic, purple and orange sky filled with swirling clouds.",
        "Style": "Epic wide shot, using a telephoto lens (100mm) to compress the distance and make the dragon feel immense against the mountains. The camera is on a slow, majestic crane shot, rising upwards. Lighting is low-key and dramatic, with the setting sun acting as a backlight, creating a powerful silhouette. The color grade is rich and saturated.",
        "Dialogue": "",
        "Sounds": "Ambient: a low, howling wind whipping through the mountain pass. SFX: the scraping of rock, the leathery flap of wings, a deep, guttural dragon's growl. Score: a deep, orchestral score with heavy brass and drums, conveying a sense of ancient power and foreboding.",
        "Technical": "Negative prompt: cute dragon, small size, cartoonish, blurry background, poor anatomy, weightless movement, unnatural wings."
    },
    "style_references": ["The Lord of the Rings: The Two Towers", "Game of Thrones"],
    "technical_specifications": "1080p, 24fps, 16:9 aspect ratio",
    "production_parameters": "Generate an 8-second clip.",
    "narrative_summary": "A massive, ancient dragon perched in a mountain pass at dusk, surveys its domain."
  };

  const animationPrompt = {
    "veo3_prompt": {
        "Subject": "A small, whimsical forest creature resembling a fluffy, round fox with large, expressive, bioluminescent blue eyes. It has oversized ears that twitch curiously and a bushy tail with a glowing tip. Its fur is a warm, autumnal orange.",
        "Action": "The creature tilts its head with a quizzical expression, its large ears swiveling to catch a sound. It then takes a bouncy, light-footed step forward, its glowing tail tip leaving a faint trail of light, and playfully pounces on a glowing mushroom, causing it to release a puff of sparkling spores.",
        "Scene": "An enchanted, oversized forest at night. Foreground: giant, softly glowing ferns. Mid-ground: The creature is on a mossy branch. Background: massive, ancient trees with luminous patterns on their bark, and a large, full moon hangs in a starry sky.",
        "Style": "Styled to look like a high-end 3D animated film. The camera is at the creature's eye-level with a shallow depth of field, using a 50mm lens to create a sense of intimacy. The movement is a gentle, floating drift to the right. Lighting is magical and soft, emanating from the various glowing plants and the moon. The color palette is vibrant and saturated with deep blues, purples, and warm oranges.",
        "Dialogue": "",
        "Sounds": "Ambient: a gentle chorus of magical insect chirps and soft, rustling leaves. SFX: a soft 'poof' sound as the mushroom releases spores, tiny, light footsteps on moss. Score: a gentle, wondrous, and slightly mysterious score featuring a celesta and pizzicato strings.",
        "Technical": "Negative prompt: realistic animal, scary, dark, flat lighting, 2D animation, clunky movement, photorealism."
    },
    "style_references": ["Studio Ghibli's 'My Neighbor Totoro'", "Pixar's 'Brave' (forest scenes)"],
    "technical_specifications": "1080p, 24fps, 16:9 aspect ratio",
    "production_parameters": "Generate an 8-second clip.",
    "narrative_summary": "A whimsical, glowing fox-like creature playfully interacts with its magical forest environment at night."
  };

  return React.createElement(React.Fragment, null,
    React.createElement('p', null, 'Here are complete, professional-grade JSON prompt structures for different genres, incorporating the principles from all previous chapters. Use these as templates.'),
    React.createElement(PromptExample, {
      title: "Sci-Fi - Complete Professional JSON Prompt",
      language: 'json',
      code: JSON.stringify(sciFiPrompt, null, 2)
    }),
    React.createElement(PromptExample, {
      title: "Fantasy - Complete Professional JSON Prompt",
      language: 'json',
      code: JSON.stringify(fantasyPrompt, null, 2)
    }),
    React.createElement(PromptExample, {
        title: "Animation - Complete Professional JSON Prompt",
        language: 'json',
        code: JSON.stringify(animationPrompt, null, 2)
      })
  );
};
const chapter16Text = "Here are complete, professional-grade JSON prompt structures for different genres, incorporating the principles from all previous chapters. Use these as templates. Examples provided include a detailed Sci-Fi prompt for an astronaut, a Fantasy prompt for an ancient dragon in a mountain pass, and a whimsical Animation prompt for a magical forest creature.";

const Chapter17Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'A single shot rarely tells the whole story. To build a complete scene, you need "coverage"—shooting the same action from different angles and shot sizes. This gives you editing options later.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'The Holy Trinity of Coverage'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Wide Shot (WS) / Establishing Shot:'), ' Shows the entire scene and the subject\'s relationship to it. Establishes geography.'),
    React.createElement('li', null, React.createElement('strong', null, 'Medium Shot (MS):'), ' Frames the subject from the waist up. Focuses on the subject and their actions while retaining some environmental context.'),
    React.createElement('li', null, React.createElement('strong', null, 'Close-Up (CU):'), ' Frames just the subject\'s face. Conveys emotion and intimacy.')
  ),
  React.createElement('h4', { className: "text-xl mt-4 mb-2" }, 'Workflow for Consistency:'),
  React.createElement('p', null, 'When prompting for coverage, copy and paste your detailed "Subject," "Scene," and "Action" components. Only change the "Style" component to specify the new shot size (e.g., change "Medium close-up shot" to "Wide shot"). This is the key to maintaining consistency across your clips.')
);
const chapter17Text = "To build a complete scene, you need 'coverage'—shooting the same action from different angles. The Holy Trinity of Coverage includes the Wide Shot to establish geography, the Medium Shot to focus on the subject and their actions, and the Close-Up to convey emotion. For consistency, when prompting for coverage, copy your detailed Subject, Scene, and Action components, and only change the Style component to specify the new shot size.";

const Chapter18Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'Treat AI video generation like a professional film production. A systematic pipeline saves time and produces higher-quality, more consistent results.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'The 5-Step Production Pipeline'),
  React.createElement('ol', { className: 'list-decimal list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, '1. Concept & Shot List:'), ' Before you prompt, write down your idea. Break it into a sequence of specific shots (e.g., 1. WS of detective entering diner. 2. MS of him sitting down. 3. CU of his tired face).'),
    React.createElement('li', null, React.createElement('strong', null, '2. Master Prompt Creation:'), ' Create one hyper-detailed "Master Prompt" for the most important shot in your sequence. Perfect the Subject, Scene, and Style here.'),
    React.createElement('li', null, React.createElement('strong', null, '3. Iterative Generation:'), ' Use the Master Prompt to generate the first clip. Review it. Does the character look right? Is the mood correct? Adjust the prompt and regenerate until it\'s perfect.'),
    React.createElement('li', null, React.createElement('strong', null, '4. Coverage & Scene Building:'), ' Once the Master Prompt is locked, copy it to generate the other shots from your list, changing only the necessary elements (like camera angle or action).'),
    React.createElement('li', null, React.createElement('strong', null, '5. Final Edit:'), ' Assemble your generated clips in a video editor to create the final narrative sequence.')
  )
);
const chapter18Text = "Treat AI video generation like a professional film production. The 5-Step Production Pipeline is: 1. Create a Concept & Shot List. 2. Develop a hyper-detailed Master Prompt for the most important shot. 3. Use Iterative Generation to perfect the first clip. 4. Generate Coverage & build the scene using the master prompt as a base. 5. Assemble your clips in a Final Edit.";

const Chapter19Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'Music videos combine narrative, performance, and aesthetics. VEO 3 is a powerful tool for creating stunning visuals that complement the music.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'Strategies for Music Videos'),
  React.createElement('ul', { className: 'list-disc list-inside space-y-2' },
    React.createElement('li', null, React.createElement('strong', null, 'Performance Shots:'), ' Use a highly detailed "Subject" description of the musical artist. The "Action" should be specific to their performance style (e.g., "strums an acoustic guitar with passion," "dances with sharp, energetic movements," "sings directly into the camera").'),
    React.createElement('li', null, React.createElement('strong', null, 'Syncing to the Beat:'), ' While VEO 3 can\'t hear your song, you can imply rhythm in your prompt. Use words like "pulsating lights," "rhythmic camera cuts," "action synchronized to a heavy bass drum beat."'),
    React.createElement('li', null, React.createElement('strong', null, 'Abstract Visuals:'), ' Use the music\'s mood to inspire surreal and abstract prompts. (e.g., "For a dreamy synth-pop song: A figure walks through a neon forest where the trees are made of liquid light.").')
  )
);
const chapter19Text = "VEO 3 is a powerful tool for music videos. Strategies include creating detailed Performance Shots of the artist with specific actions. For Syncing to the Beat, imply rhythm in your prompt with words like 'pulsating lights' or 'rhythmic camera cuts.' For Abstract Visuals, use the music's mood to inspire surreal prompts, like a figure walking through a neon forest.";

const Chapter20Content = () => React.createElement(React.Fragment, null,
  React.createElement('p', null, 'An 8-second clip is a micro-story. To make it compelling, you need to imply a larger narrative and create an emotional impact quickly.'),
  React.createElement('h3', { className: "text-2xl mt-6 mb-2" }, 'The 8-Second Narrative Arc'),
  React.createElement('p', null, 'Structure your prompt to contain a miniature three-act structure:'),
  React.createElement('ol', { className: 'list-decimal list-inside space-y-2 mt-2' },
    React.createElement('li', null, React.createElement('strong', null, 'The Setup (Seconds 1-2):'), ' Establish the character and the situation. (e.g., "A knight stands before a massive, sealed stone door.").'),
    React.createElement('li', null, React.createElement('strong', null, 'The Confrontation (Seconds 3-6):'), ' The main action or conflict occurs. (e.g., "With a mighty roar, he heaves against the door, muscles straining.").'),
    React.createElement('li', null, React.createElement('strong', null, 'The Resolution (Seconds 7-8):'), ' The immediate outcome of the action, which often asks a new question. (e.g., "The door grinds open a few inches, revealing a blinding golden light from within.").')
  ),
  React.createElement('p', { className: 'mt-4' }, 'This structure turns a simple action into a moment of story, making the clip feel like a scene from a larger, epic film. Congratulations, you have now completed the mastery guide!')
);
const chapter20Text = "An 8-second clip is a micro-story. To make it compelling, use the 8-Second Narrative Arc. The Setup, in the first two seconds, establishes the character and situation. The Confrontation, from seconds three to six, is the main action. The Resolution, in the final seconds, shows the immediate outcome. This structure turns a simple action into a moment of story. Congratulations, you have now completed the mastery guide!";

export const journeyContent = [
  { title: 'Introduction to Veo 3', content: Chapter1Content, text: chapter1Text },
  { title: 'The Prompt Structure', content: Chapter2Content, text: chapter2Text },
  { title: 'Cinematographic Fundamentals', content: Chapter3Content, text: chapter3Text },
  { title: 'Shot Configuration Mastery', content: Chapter4Content, text: chapter4Text },
  { title: 'Subject Definition Excellence', content: Chapter5Content, text: chapter5Text },
  { title: 'Scene Context Creation', content: Chapter6Content, text: chapter6Text },
  { title: 'Visual Details & Action Choreography', content: Chapter7Content, text: chapter7Text },
  { title: 'Cinematography Deep Dive', content: Chapter8Content, text: chapter8Text },
  { title: 'Audio Design Integration', content: Chapter9Content, text: chapter9Text },
  { title: 'Dialogue and Lip-Sync', content: Chapter10Content, text: chapter10Text },
  { title: 'Creative Transitions Mastery', content: Chapter11Content, text: chapter11Text },
  { title: 'VFX and Reality Manipulation', content: Chapter12Content, text: chapter12Text },
  { title: 'Genre-Specific Strategies', content: Chapter13Content, text: chapter13Text },
  { title: 'Image-to-Video Workflows', content: Chapter14Content, text: chapter14Text },
  { title: 'Common Pitfalls and Solutions', content: Chapter15Content, text: chapter15Text },
  { title: 'Complete Prompt Examples', content: Chapter16Content, text: chapter16Text },
  { title: 'Building Shot Coverage', content: Chapter17Content, text: chapter17Text },
  { title: 'Workflow & Production Pipeline', content: Chapter18Content, text: chapter18Text },
  { title: 'Music Video Production', content: Chapter19Content, text: chapter19Text },
  { title: 'Cinematic Storytelling', content: Chapter20Content, text: chapter20Text },
];
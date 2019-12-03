import { library } from '@fortawesome/fontawesome-svg-core';

import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faRedditAlien } from '@fortawesome/free-brands-svg-icons/faRedditAlien';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons/faFacebookMessenger';
import { faTelegramPlane } from '@fortawesome/free-brands-svg-icons/faTelegramPlane';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons/faCommentAlt';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';

const icons = [ faFacebookF, faTwitter, faRedditAlien, faWhatsapp, faFacebookMessenger, faTelegramPlane, faEnvelope, faCommentAlt ];

library.add(...icons);

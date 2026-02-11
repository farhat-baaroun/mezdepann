import { memo, useActionState, useEffect, useRef } from 'react';
import { actions } from 'astro:actions';
import { withState } from '@astrojs/react/actions';
import type { SafeResult } from 'astro:actions';
import { toast } from 'sonner';
import { SITE } from '../../config/site';

type ContactFormResponse = {
  success: boolean;
  message: string;
};

type ContactFormState = SafeResult<ContactFormResponse, ContactFormResponse>;

/** Safely check if error is input validation error - avoids any instanceof/constructor issues */
function safeIsInputError(err: unknown): err is { type: string; fields: Record<string, string[]> } {
  try {
    return !!(err && typeof err === 'object' && 'type' in err && (err as { type: string }).type === 'AstroActionInputError' && 'fields' in err);
  } catch {
    return false;
  }
}

/** Safely extract error message - never uses instanceof */
function getErrorMessage(err: unknown): string {
  if (!err) return '';
  if (typeof err === 'string') return err;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const msg = (err as { message: unknown }).message;
    return typeof msg === 'string' ? msg : String(msg ?? err);
  }
  return String(err);
}

const ContactForm = memo(function ContactForm() {
  const initialState: ContactFormState = { data: undefined, error: undefined };
  
  const [state, action, pending] = useActionState(
    withState(actions.contact),
    initialState
  );
  
  // Track previous state to avoid duplicate toasts
  const prevStateRef = useRef<ContactFormState>(initialState);
  const hasShownToastRef = useRef(false);


  useEffect(() => {
    const prevState = prevStateRef.current;
    
    // Handle success - only show once when success changes from false/undefined to true
    if (state?.data && !prevState?.data) {
      const message = state.data.message || 'Votre demande a été envoyée avec succès ! Nous vous recontacterons rapidement.';
      toast.success(message, {
        duration: 4000,
      });
      hasShownToastRef.current = true;
    }

    // Handle errors - only show when error appears or changes
    // Don't show toast for input validation errors (they're shown inline)
    if (state?.error && !safeIsInputError(state.error)) {
      const prevErrorMessage = getErrorMessage(prevState?.error);
      const currentErrorMessage = getErrorMessage(state.error);

      // Only show toast if error message changed or if there was no previous error
      if (!prevState?.error || prevErrorMessage !== currentErrorMessage) {
        const errorMessage = currentErrorMessage || 'Une erreur est survenue. Veuillez réessayer.';
        toast.error(errorMessage, {
          duration: 6000,
        });
        hasShownToastRef.current = true;
      }
    }

    // Reset toast flag when state resets
    if (!state?.data && !state?.error && hasShownToastRef.current) {
      hasShownToastRef.current = false;
    }

    // Update previous state
    prevStateRef.current = state || initialState;
  }, [state]);

  // Extract field errors - use safe check to avoid instanceof/serialization issues
  const fieldErrors = safeIsInputError(state?.error) ? state.error.fields : {};
  return (
    <section className="py-24 bg-dark" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Contact Info */}
          <div>
            <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-4">
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Besoin d'un Épaviste ?</h2>
            <p className="text-gray-500 mb-8">
              Contactez-nous maintenant. Disponible 24h/24, 7j/7.
            </p>

            <div className="space-y-4">
              {/* Phone */}
              <a
                href={`tel:${SITE.phone}`}
                className="flex items-center gap-4 p-4 bg-charcoal border border-white/5 rounded-xl hover:border-accent/30 transition-colors"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Téléphone</p>
                  <p className="text-white text-lg font-semibold">{SITE.phoneDisplay}</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${SITE.phone.replace('+', '')}?text=Bonjour,%20j'ai%20besoin%20de%20vos%20services%20d'épaviste`}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-4 p-4 bg-charcoal border border-white/5 rounded-xl hover:border-green-500/30 transition-colors"
              >
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">WhatsApp</p>
                  <p className="text-white text-lg font-semibold">{SITE.phoneDisplay}</p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-4 p-4 bg-charcoal border border-white/5 rounded-xl hover:border-accent/30 transition-colors"
              >
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white text-lg font-semibold">{SITE.email}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-charcoal border border-white/10 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm text-accent mb-4">
                Contact
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Contactez-nous</h2>
              <p className="text-gray-400">
                Remplissez le formulaire ci-dessous et nous vous recontacterons dans les plus brefs
                délais.
              </p>
            </div>

            <form action={action} method="POST" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-300 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    required
                         className={`w-full px-4 py-3 bg-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                           fieldErrors.nom
                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                             : 'border-white/10 focus:border-accent focus:ring-accent'
                         }`}
                    placeholder="Votre nom"
                  />
                       {fieldErrors.nom && (
                         <p className="mt-1 text-sm text-red-400">{fieldErrors.nom.join(', ')}</p>
                       )}
                </div>
                <div>
                  <label
                    htmlFor="telephone"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    required
                         className={`w-full px-4 py-3 bg-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                           fieldErrors.telephone
                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                             : 'border-white/10 focus:border-accent focus:ring-accent'
                         }`}
                    placeholder="06 12 34 56 78"
                  />
                       {fieldErrors.telephone && (
                         <p className="mt-1 text-sm text-red-400">{fieldErrors.telephone.join(', ')}</p>
                       )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                         className={`w-full px-4 py-3 bg-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${
                           fieldErrors.email
                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                             : 'border-white/10 focus:border-accent focus:ring-accent'
                         }`}
                  placeholder="votre@email.fr"
                />
                       {fieldErrors.email && (
                         <p className="mt-1 text-sm text-red-400">{fieldErrors.email.join(', ')}</p>
                       )}
              </div>

              <div>
                <label htmlFor="vehicule" className="block text-sm font-medium text-gray-300 mb-2">
                  Type de véhicule
                </label>
                <select
                  id="vehicule"
                  name="vehicule"
                  required
                         className={`w-full px-4 py-3 bg-dark border rounded-lg text-white focus:outline-none focus:ring-1 transition-colors ${
                           fieldErrors.vehicule
                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                             : 'border-white/10 focus:border-accent focus:ring-accent'
                         }`}
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="voiture">Voiture</option>
                  <option value="moto">Moto / Scooter</option>
                  <option value="utilitaire">Utilitaire</option>
                  <option value="autre">Autre</option>
                </select>
                       {fieldErrors.vehicule && (
                         <p className="mt-1 text-sm text-red-400">{fieldErrors.vehicule.join(', ')}</p>
                       )}
              </div>

              <div>
                <label htmlFor="etat" className="block text-sm font-medium text-gray-300 mb-2">
                  État du véhicule
                </label>
                <select
                  id="etat"
                  name="etat"
                  required
                         className={`w-full px-4 py-3 bg-dark border rounded-lg text-white focus:outline-none focus:ring-1 transition-colors ${
                           fieldErrors.etat
                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                             : 'border-white/10 focus:border-accent focus:ring-accent'
                         }`}
                >
                  <option value="">Sélectionnez l'état</option>
                  <option value="accidente">Accidenté</option>
                  <option value="hors-service">Hors service</option>
                  <option value="sans-ct">Sans contrôle technique</option>
                  <option value="brule">Brûlé</option>
                  <option value="immerge">Immergé</option>
                  <option value="autre">Autre</option>
                </select>
                       {fieldErrors.etat && (
                         <p className="mt-1 text-sm text-red-400">{fieldErrors.etat.join(', ')}</p>
                       )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                         className={`w-full px-4 py-3 bg-dark border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors resize-none ${
                           fieldErrors.message
                             ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                             : 'border-white/10 focus:border-accent focus:ring-accent'
                         }`}
                  placeholder="Décrivez votre situation..."
                />
                       {fieldErrors.message && (
                         <p className="mt-1 text-sm text-red-400">{fieldErrors.message.join(', ')}</p>
                       )}
              </div>

              <button
                type="submit"
                disabled={pending}
                className="w-full btn-primary py-4 px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Envoyer ma demande
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Ou contactez-nous directement par{' '}
                <a href={`tel:${SITE.phone}`} className="text-accent hover:underline">
                  téléphone
                </a>
                ,{' '}
                <a
                  href={`https://wa.me/${SITE.phone.replace('+', '')}`}
                  className="text-green-400 hover:underline"
                >
                  WhatsApp
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ContactForm;

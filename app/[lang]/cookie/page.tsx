import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { alternatesPer } from "@/lib/i18n/sito";
import { haLingua, type Lingua } from "@/lib/i18n/lingue";

const testi: Record<Lingua, { titolo: string; intro: string; tecnici: string; lingua: string; sessione: string; mappaTitolo: string; mappa: string; revoca: string; google: string; gestioneTitolo: string; gestione: string; contatti: string }> = {
  it: {
    titolo: "Informativa cookie", intro: "Questa pagina descrive i cookie e le tecnologie simili utilizzati dal sito Delsigel.",
    tecnici: "Strumenti tecnici", lingua: "NEXT_LOCALE: ricorda la lingua scelta. È un cookie del sito conservato fino a 12 mesi.",
    sessione: "Memoria di sessione: il sito ricorda in questa scheda se alcune animazioni iniziali sono già state visualizzate. I dati restano nella sessione del browser e sono normalmente rimossi alla chiusura della scheda.",
    mappaTitolo: "Mappa Google", mappa: "La mappa nel footer è disattivata inizialmente. Se scegli di attivarla, il browser si collega a Google, che può ricevere dati di navigazione e utilizzare cookie o tecnologie simili secondo la propria informativa.",
    revoca: "Puoi disattivare la mappa con il pulsante sotto di essa. La scelta vale per la pagina corrente; alla successiva navigazione la mappa torna disattivata. La disattivazione non cancella automaticamente eventuali cookie già memorizzati da Google.",
    google: "Informativa privacy di Google", gestioneTitolo: "Gestire i dati nel browser", gestione: "Puoi visualizzare o eliminare cookie e dati dei siti dalle impostazioni del browser. Le opzioni variano a seconda del browser e del dispositivo.",
    contatti: "Per informazioni: info@delsigel.it. L'informativa privacy generale sarà resa disponibile separatamente.",
  },
  en: {
    titolo: "Cookie information", intro: "This page describes cookies and similar technologies used by the Delsigel website.",
    tecnici: "Technical storage", lingua: "NEXT_LOCALE remembers your chosen language. This first-party cookie is retained for up to 12 months.",
    sessione: "Session storage: the site remembers in this tab whether introductory animations have already played. Data remains for the browser session and is normally removed when the tab is closed.",
    mappaTitolo: "Google map", mappa: "The map in the footer is initially disabled. If you choose to enable it, your browser connects to Google, which may receive browsing data and use cookies or similar technologies according to its privacy policy.",
    revoca: "You can disable the map using the button below it. Your choice applies to the current page; the map is disabled again on the next navigation. Disabling it does not automatically delete cookies already stored by Google.",
    google: "Google privacy policy", gestioneTitolo: "Manage browser data", gestione: "You can view or delete cookies and site data in your browser settings. Options vary by browser and device.", contatti: "For information: info@delsigel.it. The general privacy notice will be provided separately.",
  },
  fr: {
    titolo: "Informations sur les cookies", intro: "Cette page décrit les cookies et technologies similaires utilisés par le site Delsigel.",
    tecnici: "Stockage technique", lingua: "NEXT_LOCALE mémorise la langue choisie. Ce cookie du site est conservé jusqu'à 12 mois.",
    sessione: "Stockage de session : le site mémorise dans cet onglet si les animations initiales ont déjà été vues. Les données sont normalement supprimées à la fermeture de l'onglet.",
    mappaTitolo: "Carte Google", mappa: "La carte en pied de page est désactivée par défaut. Si vous l'activez, votre navigateur se connecte à Google, qui peut recevoir des données de navigation et utiliser des cookies ou technologies similaires selon sa politique de confidentialité.",
    revoca: "Vous pouvez désactiver la carte avec le bouton situé en dessous. Ce choix vaut pour la page actuelle ; la carte est désactivée à la navigation suivante. La désactivation ne supprime pas automatiquement les cookies déjà stockés par Google.",
    google: "Politique de confidentialité Google", gestioneTitolo: "Gérer les données du navigateur", gestione: "Vous pouvez consulter ou supprimer les cookies et données des sites dans les paramètres de votre navigateur. Les options varient selon le navigateur et l'appareil.", contatti: "Pour toute information : info@delsigel.it. L'information générale sur la confidentialité sera fournie séparément.",
  },
  de: {
    titolo: "Cookie-Informationen", intro: "Diese Seite beschreibt Cookies und ähnliche Technologien auf der Delsigel-Website.",
    tecnici: "Technische Speicherung", lingua: "NEXT_LOCALE speichert die gewählte Sprache. Dieses Cookie der Website bleibt bis zu 12 Monate gespeichert.",
    sessione: "Sitzungsspeicher: Die Website merkt sich in diesem Tab, ob die Einstiegsanimationen bereits angezeigt wurden. Die Daten werden normalerweise beim Schließen des Tabs gelöscht.",
    mappaTitolo: "Google-Karte", mappa: "Die Karte im Footer ist zunächst deaktiviert. Wenn Sie sie aktivieren, verbindet sich Ihr Browser mit Google. Google kann Navigationsdaten erhalten und gemäß seiner Datenschutzerklärung Cookies oder ähnliche Technologien verwenden.",
    revoca: "Sie können die Karte über die Schaltfläche darunter deaktivieren. Ihre Wahl gilt für die aktuelle Seite; beim nächsten Seitenwechsel ist die Karte wieder deaktiviert. Bereits von Google gespeicherte Cookies werden dadurch nicht automatisch gelöscht.",
    google: "Google-Datenschutzerklärung", gestioneTitolo: "Browserdaten verwalten", gestione: "Cookies und Websitedaten können Sie in den Browsereinstellungen ansehen oder löschen. Die Optionen variieren je nach Browser und Gerät.", contatti: "Für Informationen: info@delsigel.it. Die allgemeine Datenschutzerklärung wird gesondert bereitgestellt.",
  },
  fi: {
    titolo: "Evästetiedot", intro: "Tällä sivulla kerrotaan Delsigelin verkkosivuston evästeistä ja vastaavista tekniikoista.",
    tecnici: "Tekninen tallennus", lingua: "NEXT_LOCALE muistaa valitsemasi kielen. Sivuston eväste säilyy enintään 12 kuukautta.",
    sessione: "Istuntotallennus: sivusto muistaa tällä välilehdellä, onko aloitusanimaatiot jo näytetty. Tiedot poistuvat yleensä välilehden sulkemisen yhteydessä.",
    mappaTitolo: "Google-kartta", mappa: "Alatunnisteen kartta on aluksi pois käytöstä. Jos otat sen käyttöön, selain muodostaa yhteyden Googleen, joka voi vastaanottaa selaustietoja ja käyttää evästeitä tai vastaavia tekniikoita tietosuojakäytäntönsä mukaisesti.",
    revoca: "Voit poistaa kartan käytöstä sen alla olevalla painikkeella. Valinta koskee nykyistä sivua; seuraavalla sivulla kartta on jälleen pois käytöstä. Poistaminen ei automaattisesti poista Googlen jo tallentamia evästeitä.",
    google: "Googlen tietosuojakäytäntö", gestioneTitolo: "Selaintietojen hallinta", gestione: "Voit tarkastella tai poistaa evästeitä ja sivustotietoja selaimen asetuksista. Vaihtoehdot vaihtelevat selaimen ja laitteen mukaan.", contatti: "Lisätietoja: info@delsigel.it. Yleinen tietosuojaseloste toimitetaan erikseen.",
  },
};

export async function generateMetadata({ params }: PageProps<"/[lang]/cookie">): Promise<Metadata> {
  const { lang } = await params;
  if (!haLingua(lang)) return {};
  return { title: testi[lang].titolo, alternates: alternatesPer(lang, "/cookie") };
}

export default async function CookiePage({ params }: PageProps<"/[lang]/cookie">) {
  const { lang } = await params;
  if (!haLingua(lang)) notFound();
  const t = testi[lang];
  return (
    <div className="flex min-h-svh flex-col bg-panna text-inchiostro">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-36 sm:px-10 sm:pt-44">
        <h1 className="font-hero text-5xl uppercase tracking-tight sm:text-7xl">{t.titolo}</h1>
        <p className="mt-8 text-lg leading-relaxed">{t.intro}</p>
        <section className="mt-12 space-y-4 leading-relaxed">
          <h2 className="font-hero text-3xl uppercase">{t.tecnici}</h2>
          <p>{t.lingua}</p><p>{t.sessione}</p>
        </section>
        <section className="mt-12 space-y-4 leading-relaxed">
          <h2 className="font-hero text-3xl uppercase">{t.mappaTitolo}</h2>
          <p>{t.mappa}</p><p>{t.revoca}</p>
          <a className="font-bold underline underline-offset-4" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">{t.google} ↗</a>
        </section>
        <section className="mt-12 space-y-4 leading-relaxed">
          <h2 className="font-hero text-3xl uppercase">{t.gestioneTitolo}</h2>
          <p>{t.gestione}</p><p>{t.contatti}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

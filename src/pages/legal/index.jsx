import { motion } from 'framer-motion'
import SEO from '../../components/seo/SEO'

const COMPANY = 'SYM COMPUTER SAS'

const legalPages = {
  'politica-privacidad': {
    title: 'Política de Privacidad',
    sections: [
      {
        h2: 'Introducción',
        content: 'La presente Política de Privacidad establece los términos en que SYM COMPUTER SAS usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Esta compañía está comprometida con la seguridad de los datos de sus usuarios. Cuando le pedimos llenar los campos de información personal con la cual usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento. Sin embargo, esta Política de Privacidad puede cambiar con el tiempo o ser actualizada, por lo que le recomendamos y enfatizamos revisar continuamente esta página para asegurarse de que está de acuerdo con dichos cambios.',
      },
      {
        h2: 'Información que es recogida',
        content: 'Nuestro sitio web podrá recoger información personal, por ejemplo: nombre, información de contacto como su dirección de correo electrónico e información demográfica. Así mismo, cuando sea necesario, podrá ser requerida información específica para procesar algún pedido o realizar una entrega o facturación.',
      },
      {
        h2: 'Uso de la información recogida',
        content: 'Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos en caso de que aplique, y mejorar nuestros productos y servicios. Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio. Estos correos electrónicos serán enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento.\n\nSYM COMPUTER SAS está altamente comprometido con mantener su información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos de que no exista ningún acceso no autorizado.',
      },
      {
        h2: 'Cookies',
        content: 'Una cookie es un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador. Al aceptar dicho fichero se crea la cookie, que sirve para tener información respecto al tráfico web y también facilita las futuras visitas a una web recurrente. Otra función de las cookies es que con ellas las webs pueden reconocerlo individualmente y, por tanto, brindarle el mejor servicio personalizado.\n\nNuestro sitio web emplea cookies para identificar las páginas que son visitadas y su frecuencia. Esta información es empleada únicamente para análisis estadístico y después se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Las cookies ayudan a proporcionar un mejor servicio de los sitios web; no dan acceso a información de su ordenador ni de usted, a menos que usted así lo quiera y la proporcione directamente.\n\nUsted puede aceptar o negar el uso de cookies; sin embargo, la mayoría de navegadores las aceptan automáticamente pues sirven para tener un mejor servicio web. También puede cambiar la configuración de su ordenador para declinar las cookies. Si se declinan, es posible que no pueda utilizar algunos de nuestros servicios.',
      },
      {
        h2: 'Enlaces a terceros',
        content: 'Este sitio web podría contener enlaces a otros sitios que pudieran ser de su interés. Una vez que usted dé clic en estos enlaces y abandone nuestra página, ya no tenemos control sobre el sitio al que es redirigido y, por lo tanto, no somos responsables de los términos, la privacidad ni la protección de sus datos en esos otros sitios. Dichos sitios están sujetos a sus propias políticas de privacidad, por lo cual es recomendable que los consulte para confirmar que está de acuerdo con ellas.',
      },
      {
        h2: 'Control de su información personal',
        content: 'En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web. Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento, salvo que sea requerido por un juez con una orden judicial.\n\nSYM COMPUTER SAS se reserva el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento.',
      },
    ],
  },
  'terminos': {
    title: 'Términos y Condiciones',
    sections: [
      { h2: '1. Aceptación', content: 'Al usar este sitio y realizar compras, aceptás estos términos. Si no estás de acuerdo, no utilices el servicio.' },
      { h2: '2. Productos y precios', content: 'Los precios incluyen IVA. Nos reservamos el derecho de modificar precios sin previo aviso. Las imágenes son ilustrativas. Stock sujeto a disponibilidad.' },
      { h2: '3. Proceso de compra', content: 'El pedido es una oferta de compra. La aceptación ocurre al confirmar el pago (Mercado Pago) o al confirmar por WhatsApp. Nos reservamos el derecho de cancelar pedidos por error de precio o stock.' },
      { h2: '4. Pagos', content: 'Aceptamos: Mercado Pago (tarjetas, efectivo, transferencias), transferencia bancaria, y coordinación por WhatsApp. La reserva de stock se hace al confirmar pago.' },
      { h2: '5. Envíos', content: 'Envíos a todo el país. Gratis en compras >$100.000. Tiempos estimados: 24-48hs CABA/GBA, 3-7 días interior. No nos responsabilizamos por demoras de la transportista.' },
      { h2: '6. Garantía', content: 'Todos los productos tienen garantía oficial del fabricante (12 meses típicamente). Gestionamos el trámite. Excluye daños por mal uso, golpes, humedad, o intervención de terceros.' },
      { h2: '7. Devoluciones', content: '30 días para cambio/devolución. Producto debe estar nuevo, con embalaje y accesorios. Costos de envío a nuestro cargo si hay falla de fábrica; a cargo del cliente por cambio de opinión.' },
      { h2: '8. Responsabilidad', content: 'No nos hacemos responsables por: daños indirectos, lucro cesante, fallas de conectividad, o uso indebido de productos. Responsabilidad máxima: monto del pedido.' },
      { h2: '9. Propiedad intelectual', content: 'Contenido del sitio (textos, imágenes, código, diseño) es propiedad de SYM COMPUTER SAS o usado con licencia. Prohibida su reproducción sin autorización.' },
      { h2: '10. Ley aplicable y jurisdicción', content: 'Ley Colombiana. Jurisdicción: tribunales ordinarios de Bogotá, Colombia.' },
    ]
  },
  'garantia': {
    title: 'Política de Garantía',
    sections: [
      {
        h2: 'Para hacer efectiva la garantía',
        content: 'Es necesario presentar la factura original de compra (o fotocopia de ella), no solo el producto comprado.\n\nEl producto deberá venir con su estuche o caja original, incluyendo manuales, cables y certificados de garantía, si es el caso.',
      },
      {
        h2: 'Dónde solicitar la garantía',
        content: 'La garantía de portátiles, monitores e impresoras, así como la de partes y demás productos vendidos por nosotros, puede ser tramitada directamente en nuestros establecimientos o en los puntos de servicio de cada fabricante o distribuidor mayorista. (Para portátiles y monitores el trámite debe hacerse directamente con el fabricante).',
      },
      {
        h2: 'Tiempo de garantía',
        content: 'El tiempo para resolver cualquier garantía será de máximo treinta (30) días hábiles contados a partir del día siguiente a la entrega.\n\nTambién puedes comunicarte directamente con el fabricante o mayorista de la marca de tu producto para obtener tu garantía directamente con ellos, presentando tu factura original.',
      },
      {
        h2: 'Lo que no cubre la garantía',
        content: 'La garantía no cubre mal manejo, descargas eléctricas, golpes o averías producto de aquellos, quemaduras, deterioro, desconfiguración, software, virus y productos con sellos de seguridad rotos o levantados.\n\nEn los monitores la garantía no cubre por menos de 5 píxeles.\n\nSe perderá automáticamente la garantía de cualquier producto cuando se evidencie cualquier cambio o alteración del mismo o de sus sellos de seguridad.',
      },
      {
        h2: 'Recomendaciones',
        content: 'Al momento de la compra, verifica el estado del producto, constatando que se encuentre completo e incluyendo todos sus accesorios; después de retirado el mismo del establecimiento, no se aceptan cambios ni devoluciones.',
      },
      {
        h2: 'Precios y disponibilidad',
        content: 'Precios y disponibilidad sujetos a cambio sin previo aviso.',
      },
    ]
  },
  'cambios-devoluciones': {
    title: 'Política de Devoluciones',
    sections: [
      {
        h2: 'Condiciones generales',
        content: 'Las ventas en S&M COMPUTER S.A.S se realizan en firme y son de carácter definitivo; por lo tanto, cualquier reclamo por mercancía o solicitud de una devolución debe ser considerada dentro de los términos que se detallan a continuación:\n\nA. Todo reclamo deberá presentarse al ejecutivo de ventas asignado o al agente de servicio técnico, telefónicamente o por escrito al WhatsApp 3001027613.\n\nB. Se deberá reportar la siguiente información en un máximo de cuarenta y ocho (48) horas después de la entrega: número de factura, nombre del producto, serial y cantidad.\n\nC. Es responsabilidad del cliente realizar la recepción técnica y administrativa acorde a la normativa vigente.',
      },
      {
        h2: '1. No conformidad del producto',
        content: 'Son aquellas generadas por:\n\na. Reclamos de calidad de producto: se requiere entregar el producto físicamente con la descripción exacta del inconveniente por escrito, con registro fotográfico y de video. Para estos casos deberá realizarse dentro del término de la garantía.\n\nb. Producto averiado durante el transporte contratado por S&M COMPUTER S.A.S, o faltantes de producto en empaque original. Para estos casos, se deben reportar máximo en cuarenta y ocho (48) horas después de la entrega.\n\nc. Si el transporte es contratado por el cliente, este es quien deberá generar la reclamación al transportador en caso de siniestros, averías o reclamaciones generadas en el transporte.',
      },
      {
        h2: '2. Verificación de la devolución',
        content: 'a. Antes de aceptar cualquier devolución, S&M COMPUTER S.A.S se reserva el derecho de verificar si efectivamente la compañía vendió el producto solicitado para la devolución.\n\nb. Solo se recibirá producto en devolución cuando el funcionario encargado haya previamente inventariado, verificado lotes/serie, fechas de vencimiento y documento de envío de la mercancía.\n\nc. El recoger o recibir el producto para posible devolución no implica que esta sea aceptada, hasta antes de ser verificada por el funcionario encargado directamente en la empresa.',
      },
      {
        h2: '3. Condiciones de descuentos',
        content: 'a. En ninguna circunstancia se entenderá que el cliente está facultado para descontar el valor de las devoluciones de los pagos pendientes a S&M COMPUTER S.A.S, hasta tanto no se haya elaborado y entregado al cliente un documento que así lo indique (Nota Crédito).',
      },
      {
        h2: '4. Costos de servicios',
        content: 'a. En caso de devolución de productos, garantía o por error en la solicitud por parte del cliente, incluyendo confirmaciones de cotización, este deberá asumir los gastos de flete y seguro correspondientes al despacho, desde la sede de S&M COMPUTER S.A.S a sus instalaciones y de retorno a estas. Igualmente, en caso de avería en el traslado, esta debe ser asumida por el cliente.\n\nb. El empaque utilizado para el transporte debe garantizar la custodia y conservación de los productos.',
      },
      {
        h2: '5. Casos en que no se aceptan devoluciones',
        content: 'a. Una vez hayan transcurrido más de cuarenta y ocho (48) horas contadas desde la entrega al cliente.\n\nb. Cuando el producto o su empaque se encuentre en mal estado por mala manipulación y/o almacenamiento por parte del cliente, o no se encuentre en su caja original (productos etiquetados, manchados, rayados, sucios o que se consideren deteriorados en su presentación), entre otros.\n\nc. En caso de precios especiales, ofertas y liquidaciones, aplican condiciones y restricciones.\n\nd. Devoluciones de productos por criterios del cliente, como cancelaciones de pedidos de terceros, errores en solicitudes, entre otros.',
      },
      {
        h2: '6. Aceptación de la devolución',
        content: 'a. Solo se aceptará devolución de producto en sus empaques originales, sellados, sin marcas, sin etiquetas y en buen estado.',
      },
    ]
  },
  'tratamiento-datos': {
    title: 'Política de Tratamiento de Datos',
    sections: [
      { h2: 'Finalidades', content: 'Gestión de pedidos, facturación, envíos, soporte, marketing (con consentimiento), análisis de uso, prevención de fraude, cumplimiento legal.' },
      { h2: 'Categorías de datos', content: 'Identificativos, contacto, transaccionales, navegación, preferencias, comunicaciones.' },
      { h2: 'Legitimación', content: 'Ejecución contractual, consentimiento, interés legítimo, obligación legal.' },
      { h2: 'Destinatarios', content: 'Procesadores de pago, logística, cloud, marketing, autoridades.' },
      { h2: 'Derechos', content: 'Acceso, rectificación, supresión, oposición, limitación, portabilidad, no decisiones automatizadas.' },
      { h2: 'Medidas de seguridad', content: 'Cifrado TLS 1.3, acceso por roles, logs de auditoría, backups encriptados, planes de contingencia.' },
      { h2: 'Conservación', content: 'Datos de clientes: 10 años post-relación (normativa fiscal). Marketing: hasta revocación. Navegación: 24 meses.' },
      { h2: 'Cookies', content: 'Técnicas (sesión, carrito), analíticas (GA4), publicidad (Meta). Configurable en banner.' },
    ]
  },
}

export default function LegalPage({ pageKey }) {
  const page = legalPages[pageKey] || legalPages['politica-privacidad']
  const pageTitle = page.title

  return (
    <>
      <SEO
        title={`${pageTitle} | ${COMPANY}`}
        description={`Lee la ${pageTitle.toLowerCase()} de ${COMPANY}. Información transparente sobre el uso y la protección de tus datos.`}
        noindex
      />

      <div className="min-h-screen bg-white pt-20">
        <section className="py-12 lg:py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-primary-900 mb-6 text-center">
                {pageTitle}
              </h1>
              <p className="text-primary-900/60 text-center mb-10">
                Última actualización: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <div className="prose prose max-w-none text-primary-900 space-y-6">
                {page.sections.map((section, index) => (
                  <motion.section
                    key={section.h2}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <h2 className="font-display font-semibold text-lg sm:text-xl text-primary-900 mb-3">{section.h2}</h2>
                    <div className="text-primary-900 leading-relaxed space-y-3 text-sm sm:text-base">
                      {section.content.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 p-5 bg-charcoal-50/50 border border-charcoal-100 rounded-xl text-center"
              >
                <p className="text-primary-900/70 text-sm">
                  ¿Dudas sobre esta política? <a href="/contacto" className="text-charcoal-600 hover:underline">Contáctanos</a>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export function PrivacyPolicy() {
  return <LegalPage pageKey="politica-privacidad" />
}

export function Terms() {
  return <LegalPage pageKey="terminos" />
}

export function Returns() {
  return <LegalPage pageKey="cambios-devoluciones" />
}

export function DataPolicy() {
  return <LegalPage pageKey="tratamiento-datos" />
}

export function Warranty() {
  return <LegalPage pageKey="garantia" />
}
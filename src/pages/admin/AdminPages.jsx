import { useEffect, useState } from 'react'
import { Navigate, Link, useNavigate, useParams } from 'react-router-dom'
import { Eye, EyeOff, Plus, Search, ArrowUpRight, Package, ShoppingBag, Clock, Banknote, Trash2, Pencil, X, ArrowUp, ArrowDown, Users, MousePointerClick } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { categories } from '../../data/categories'
import { gallery } from '../../data/gallery'
import { testimonials } from '../../data/testimonials'
import { formatCurrency } from '../../utils/formatCurrency'
import Button from '../../components/common/Button'
import SEO from '../../components/common/SEO'
import InstallAppButton from '../../components/common/InstallAppButton'
import PhoneInput from '../../components/common/PhoneInput'
import ProductMediaThumb from '../../components/products/ProductMediaThumb'
import { supabase } from '../../lib/supabase'
import {
  deleteCategory, deleteGalleryItem, deleteProduct, deleteProductImage, deleteTestimonial,
  getAdminOrders, getAdminProfile, getCategories, getDashboardData, getGallery,
  getProducts, getSiteContent, getSiteSettings, getTestimonials, getTrafficStats, getAuditLogs,
  reorderProductImages,
  saveAdminProfile, saveCategory, saveGalleryItem, saveProduct, saveSiteContent, uploadCatalogImage,
  saveSiteSettings, saveTestimonial, updateAdminEmail, updateAdminPassword, updateOrderStatus,
} from '../../services/catalogService'

export function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth()
  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#F2F0F1] font-display text-xl font-bold text-black">
        Vérification de la session…
      </div>
    )
  return isAuthenticated ? children : <Navigate to="/admin/connexion" replace />
}

export function LoginPage() {
  const [show, setShow] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { login, isAuthenticated, isSupabaseConfigured } = useAdminAuth()
  const navigate = useNavigate()

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      await login(formData.get('email'), formData.get('password'))
      toast.success('Connexion réussie !')
      navigate('/admin')
    } catch (error) {
      console.error('Erreur login admin :', error)
      toast.error(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou mot de passe incorrect.'
          : error.message === 'Email not confirmed'
          ? 'E-mail non confirmé dans Supabase (cochez Auto Confirm).'
          : error.message
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <SEO title="Connexion administration | FOOD PACK" />
      <div className="relative grid min-h-screen place-items-center bg-[#F2F0F1] p-5">
        <form
          onSubmit={submit}
          className="relative w-full max-w-md rounded-[24px] border border-black/10 bg-white p-8 shadow-2xl sm:p-10"
        >
          <div className="text-center">
            <Link
              to="/"
              className="font-display text-3xl font-black uppercase tracking-tight text-black"
            >
              FOOD PACK<span className="text-[#FF3333]">.</span>
            </Link>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-black/50">
              Espace Administrateur
            </p>
          </div>

          {!isSupabaseConfigured && (
            <p className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              Ajoutez les variables Supabase dans le fichier <code>.env.local</code> pour activer la connexion.
            </p>
          )}

          <label className="mt-8 block text-xs font-bold uppercase tracking-wider text-black">
            Adresse E-mail
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@foodpack.com"
              className="mt-2 w-full rounded-xl border border-black/15 bg-[#F9F8F8] px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white"
            />
          </label>

          <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-black">
            Mot de passe
            <div className="relative mt-2">
              <input
                name="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/15 bg-[#F9F8F8] px-4 py-3 pr-12 text-sm text-black outline-none transition focus:border-black focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-black/40 hover:text-black"
              >
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>

          <div className="my-5 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-black/70">
              <input type="checkbox" defaultChecked className="rounded accent-black" />
              Se souvenir de moi
            </label>
            <Link
              to="/admin/mot-de-passe-oublie"
              className="font-semibold text-black/60 hover:text-black hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting || !isSupabaseConfigured}
            className="w-full rounded-full bg-black py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-black/85 disabled:opacity-50"
          >
            {submitting ? 'Connexion en cours…' : 'Se connecter'}
          </button>

          <Link
            to="/"
            className="mt-6 block text-center text-xs font-medium text-black/40 hover:text-black"
          >
            ← Retour à la boutique
          </Link>
        </form>
      </div>
    </>
  )
}
const Title=({children,action})=><div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">Administration FOOD PACK</p><h1 className="mt-1 font-display text-3xl sm:text-4xl">{children}</h1><p className="mt-2 text-sm text-black/45">Pilotez vos produits, stocks et commandes en toute simplicité.</p></div>{action}</div>
const Status=({children})=><span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold ${children==='Livrée'||children==='Disponible'?'bg-emerald-100 text-emerald-800':children==='Nouvelle'?'bg-[#f5ead1] text-[#80601f]':'bg-[#eee5cf] text-[#6f5523]'}`}>{children}</span>
function LegacyDashboardPage(){return <><Title>Tableau de bord</Title><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[[Package,'Produits','15','+3 nouveaux formats'],[ShoppingBag,'Commandes','38','+12% ce mois'],[Clock,'En attente','7','À traiter'],[Banknote,'CA estimé','1,2 M FCFA','+18% ce mois']].map(([Icon,label,value,note],index)=><div key={label} className="group relative overflow-hidden bg-white p-5"><div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#eadbb8] transition group-hover:scale-125 dark:bg-white/5"/><div className="relative flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#faf5ea] text-gold dark:bg-white/10"><Icon className="h-5 w-5"/></span><span className="text-[10px] font-bold text-gold">{index===2?'Prioritaire':'En hausse'}</span></div><p className="relative mt-5 text-xs text-black/45">{label}</p><b className="relative mt-1 block text-2xl">{value}</b><p className="relative mt-2 text-[10px] text-black/40">{note}</p></div>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]"><div className="bg-white p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-gold">Performance</p><h2 className="mt-1 font-display text-xl">Évolution des commandes</h2></div><span className="rounded-full bg-mist px-3 py-2 text-[10px]">7 derniers mois</span></div><div className="mt-10 flex h-48 items-end gap-4">{[42,55,38,75,60,90,72].map((h,i)=><div key={i} className="flex-1 rounded-t-xl bg-gradient-to-t from-[#B38A2C] to-[#d9bd73] transition hover:brightness-105" style={{height:`${h}%`}}/>)}</div></div><div className="bg-white p-6"><p className="text-[10px] font-bold uppercase tracking-wider text-gold">Catalogue</p><h2 className="mt-1 font-display text-xl">Répartition des catégories</h2><div className="mt-6 grid gap-4">{categories.slice(0,5).map((c,i)=><div key={c.slug}><div className="mb-1.5 flex justify-between text-xs"><span>{c.name}</span><b>{25-i*3}%</b></div><div className="h-2.5 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-gradient-to-r from-[#B38A2C] to-[#d7b65e]" style={{width:`${25-i*3}%`}}/></div></div>)}</div></div></div><div className="mt-6 bg-white p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-gold">À suivre</p><h2 className="mt-1 font-display text-xl">Commandes récentes</h2></div><Link to="/admin/commandes" className="text-xs font-semibold text-gold">Voir toutes</Link></div><OrderTable/></div></>}
const orderStatus={new:'Nouvelle',confirmed:'Confirmée',in_progress:'En préparation',ready:'Prête',delivered:'Livrée',cancelled:'Annulée'}
function OrderTable({rows=[]}){const navigate=useNavigate();return <div className="dashboard-scroll mt-5 w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-3"><table className="w-full min-w-[1050px] table-auto text-left text-sm"><thead className="border-b text-xs text-black/40"><tr>{['Référence','Client','Ville','Montant','Statut','Date',''].map(label=><th key={label} className="min-w-[140px] whitespace-nowrap pb-3 pr-8 font-medium">{label}</th>)}</tr></thead><tbody>{rows.map(o=><tr key={o.id} tabIndex="0" onClick={()=>navigate('/admin/commandes/'+o.id)} onKeyDown={event=>{if(event.key==='Enter')navigate('/admin/commandes/'+o.id)}} className="cursor-pointer border-b transition hover:bg-mist/60 focus:bg-mist/60 focus:outline-none"><td className="min-w-[180px] whitespace-nowrap py-4 pr-8 font-bold">{o.order_number||o.id}</td><td className="min-w-[140px] whitespace-nowrap pr-8">{o.customer_name||o.customer}</td><td className="min-w-[140px] whitespace-nowrap pr-8">{o.city}</td><td className="min-w-[140px] whitespace-nowrap pr-8">{formatCurrency(o.total??o.amount)}</td><td className="min-w-[140px] whitespace-nowrap pr-8"><Status>{orderStatus[o.status]||o.status}</Status></td><td className="min-w-[140px] whitespace-nowrap pr-8">{o.created_at?new Date(o.created_at).toLocaleDateString('fr-FR'):o.date}</td><td><Link to={'/admin/commandes/'+o.id}><ArrowUpRight className="h-4 w-4"/></Link></td></tr>)}{!rows.length&&<tr><td colSpan="7" className="py-10 text-center text-black/45">Aucune commande enregistrée.</td></tr>}</tbody></table></div>}
export function ProductsAdmin(){const navigate=useNavigate();const [items,setItems]=useState([]);const [query,setQuery]=useState('');const [loading,setLoading]=useState(true);useEffect(()=>{getProducts({includeDrafts:true}).then(setItems).catch(error=>toast.error(error.message)).finally(()=>setLoading(false))},[]);const remove=async product=>{if(!window.confirm(`Supprimer définitivement « ${product.name} » ?`))return;try{await deleteProduct(product.id);setItems(current=>current.filter(item=>item.id!==product.id));toast.success('Produit supprimé.')}catch(error){toast.error(error.message)}};const filtered=items.filter(p=>p.name.toLowerCase().includes(query.toLowerCase()));return <><Title action={<Button to="/admin/produits/nouveau"><Plus className="h-4 w-4"/>Ajouter un produit</Button>}>Produits</Title><div className="bg-white p-5"><div className="admin-filter mb-5 flex w-full max-w-sm items-center gap-3 rounded-2xl border border-[#dfcfaa] bg-[#fffef9] px-4 py-3 transition focus-within:border-gold focus-within:ring-4 focus-within:ring-gold/10 dark:border-white/15 dark:bg-[#1f1a10]"><Search className="h-5 w-5 shrink-0 text-gold"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher" className="min-w-0 flex-1 bg-transparent outline-none"/></div>{loading?<p className="py-10 text-center text-sm text-black/45">Chargement du catalogue…</p>:<div className="overflow-x-auto"><table className="w-full min-w-[750px] text-left text-sm"><tbody>{filtered.map(p=><tr key={p.id} tabIndex="0" onClick={()=>navigate(`/admin/produits/${p.id}/modifier`)} onKeyDown={e=>{if(e.key==='Enter')navigate(`/admin/produits/${p.id}/modifier`)}} className="cursor-pointer border-t transition hover:bg-mist/60 focus:bg-mist/60 focus:outline-none"><td className="py-3"><ProductMediaThumb product={p} alt={p.name} className="h-12 w-10 rounded-lg"/></td><td><b>{p.name}</b><p className="text-[10px] text-black/40">{p.isPublished?'Publié':'Brouillon'}</p></td><td>{p.category}</td><td>{formatCurrency(p.price)}</td><td><Status>{p.stockStatus}</Status></td><td><div className="flex items-center justify-end gap-3"><span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Modifier</span><button onClick={event=>{event.stopPropagation();remove(p)}} className="text-red-700 transition hover:scale-110" aria-label={`Supprimer ${p.name}`}><Trash2 className="h-4 w-4"/></button></div></td></tr>)}{!filtered.length&&<tr><td colSpan="6" className="py-10 text-center text-black/45">Aucun produit Supabase. Ajoutez votre premier produit.</td></tr>}</tbody></table></div>}</div></>}

const emptyProduct={name:'',slug:'',categoryId:'',price:'',oldPrice:'',shortDescription:'',description:'',colors:[],sizes:[],stockStatus:'Disponible',featured:false,newProduct:true,popular:false,customizable:true,productionTime:'',materials:'',careInstructions:'',deliveryInformation:'',isPublished:true,images:[]}
const slugify=value=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const normalizeColorEntry=value=>{const clean=value.trim().toLocaleLowerCase('fr-FR');return clean?clean.charAt(0).toLocaleUpperCase('fr-FR')+clean.slice(1):''}
function ExistingProductImages({records=[],onChange}){
  const move=async(index,direction)=>{const target=index+direction;if(target<0||target>=records.length)return;const next=[...records];[next[index],next[target]]=[next[target],next[index]];try{await reorderProductImages(next);onChange(next);toast.success('Ordre des médias mis à jour.')}catch(error){toast.error(error.message)}}
  const remove=async record=>{if(!window.confirm('Supprimer définitivement ce média ?'))return;try{await deleteProductImage(record.id);onChange(records.filter(item=>item.id!==record.id));toast.success('Média supprimé.')}catch(error){toast.error(error.message)}}
  if(!records.length)return null
  return <div className="mt-5 grid gap-3"><p className="text-xs font-bold uppercase tracking-wider text-gold">Médias enregistrés</p>{records.map((record,index)=><div key={record.id} className="flex items-center gap-2 rounded-xl border p-2">{record.type==='video'?<video src={record.url} muted playsInline preload="metadata" className="h-14 w-12 rounded-lg bg-black object-cover"/>:<img src={record.url} alt="" className="h-14 w-12 rounded-lg object-cover"/>}<span className="flex-1 text-xs">{record.type==='video'?`Vidéo ${index+1}`:index===0?'Image principale':`Image ${index+1}`}</span><button type="button" disabled={index===0} onClick={()=>move(index,-1)} className="disabled:opacity-25" aria-label="Monter"><ArrowUp className="h-4 w-4"/></button><button type="button" disabled={index===records.length-1} onClick={()=>move(index,1)} className="disabled:opacity-25" aria-label="Descendre"><ArrowDown className="h-4 w-4"/></button><button type="button" onClick={()=>remove(record)} className="text-red-700" aria-label="Supprimer"><Trash2 className="h-4 w-4"/></button></div>)}</div>
}
const normalizeSizeEntry=value=>value.trim()
export function ProductFormPage(){const {id}=useParams();const navigate=useNavigate();const [product,setProduct]=useState(emptyProduct);const [categoryOptions,setCategoryOptions]=useState([]);const [files,setFiles]=useState([]);const [saving,setSaving]=useState(false);const editing=Boolean(id);useEffect(()=>{Promise.all([getCategories(),editing?getProducts({includeDrafts:true}):Promise.resolve([])]).then(([nextCategories,nextProducts])=>{setCategoryOptions(nextCategories);if(editing){const found=nextProducts.find(item=>item.id===Number(id));if(found)setProduct(found)}}).catch(error=>toast.error(error.message))},[editing,id]);const update=(key,value)=>setProduct(current=>({...current,[key]:value}));const submit=async e=>{e.preventDefault();setSaving(true);try{await saveProduct({...product,slug:product.slug||slugify(product.name)},files);toast.success('Produit enregistré dans Supabase.');navigate('/admin/produits')}catch(error){toast.error(error.message)}finally{setSaving(false)}};const previewFile=files[0];const preview=previewFile?URL.createObjectURL(previewFile):(product.media?.[0]?.url||product.images?.[0]);const previewIsVideo=previewFile?previewFile.type.startsWith("video/"):product.media?.[0]?.type==="video";return <><Title>{editing?'Modifier le produit':'Nouveau produit'}</Title><form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_320px]"><div className="grid gap-5 bg-white p-6"><label className="text-sm font-semibold">Nom du produit<input required value={product.name} onChange={e=>update('name',e.target.value)} placeholder="Ex. Bouteille PET Cristal 330ml" className="mt-2 w-full border px-4 py-3"/></label><label className="text-sm font-semibold">Identifiant URL (slug)<input value={product.slug} onChange={e=>update('slug',slugify(e.target.value))} placeholder={slugify(product.name)||'bouteille-pet-bissap-330ml'} className="mt-2 w-full border px-4 py-3"/></label><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Catégorie<select required value={product.categoryId||''} onChange={e=>update('categoryId',e.target.value)} className="mt-2 w-full border bg-white px-4 py-3"><option value="">Sélectionner</option>{categoryOptions.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label className="text-sm font-semibold">Prix (FCFA)<input required min="0" type="number" value={product.price} onChange={e=>update('price',e.target.value)} className="mt-2 w-full border px-4 py-3"/></label></div><label className="text-sm font-semibold">Disponibilité<select required value={product.stockStatus} onChange={e=>update('stockStatus',e.target.value)} className="mt-2 w-full border bg-white px-4 py-3"><option value="Disponible">Disponible immédiatement</option><option value="Sur commande">Sur commande / Gros volume</option><option value="Indisponible">Rupture temporaire</option></select></label><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Contenances / Capacités (séparées par virgules)<input value={product.colors?.join(', ') || ''} onChange={e=>update('colors',e.target.value.split(',').map(normalizeColorEntry))} placeholder="250ml, 330ml, 500ml, 1L" className="mt-2 w-full border px-4 py-3"/><span className="mt-1 block text-[10px] font-normal text-black/40">Exemple : 250ml, 330ml, 500ml</span></label><label className="text-sm font-semibold">Formats / Conditionnements (séparés par virgules)<input value={product.sizes?.join(', ') || ''} onChange={e=>update('sizes',e.target.value.split(',').map(normalizeSizeEntry))} placeholder="Lot de 50, Carton de 500" className="mt-2 w-full border px-4 py-3"/><span className="mt-1 block text-[10px] font-normal text-black/40">Exemple : Lot de 50, Carton de 250</span></label></div><label className="text-sm font-semibold">Description courte<textarea rows="3" value={product.shortDescription||''} onChange={e=>update('shortDescription',e.target.value)} placeholder="Description rapide pour les fiches produits" className="mt-2 w-full border px-4 py-3"/></label><label className="text-sm font-semibold">Description complète<textarea rows="7" value={product.description||''} onChange={e=>update('description',e.target.value)} placeholder="Détails techniques, usages recommandés, certifications..." className="mt-2 w-full border px-4 py-3"/></label><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Disponibilité / Délai<input value={product.productionTime||''} onChange={e=>update('productionTime',e.target.value)} placeholder="Ex. En stock (Livraison 24h)" className="mt-2 w-full border px-4 py-3"/></label><label className="text-sm font-semibold">Matériaux<input value={product.materials||''} onChange={e=>update('materials',e.target.value)} placeholder="Ex. Plastique PET alimentaire cristal" className="mt-2 w-full border px-4 py-3"/></label></div><Button type="submit" disabled={saving}>{saving?'Enregistrement…':'Enregistrer le produit'}</Button></div><aside className="h-fit bg-white p-6"><h2 className="font-display text-xl">Photos et visuels</h2><label className="mt-4 grid aspect-square cursor-pointer place-items-center overflow-hidden border-2 border-dashed bg-mist text-center text-sm text-black/40">{preview?(previewIsVideo?<video src={preview} muted controls playsInline className="h-full w-full bg-black object-contain"/>:<img src={preview} alt="" className="h-full w-full object-cover"/>):<span>Choisir des photos ou vidéos</span>}<input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" multiple onChange={e=>setFiles([...e.target.files])} className="sr-only"/></label><p className="mt-2 text-[10px] text-black/40">{files.length?`${files.length} média(s) sélectionné(s)`:'JPG, PNG, WebP · 50 Mo maximum'}</p><ExistingProductImages records={product.imageRecords} onChange={records=>setProduct(current=>({...current,imageRecords:records,media:records,images:records.filter(item=>item.type!=="video").map(item=>item.url)}))}/><div className="mt-5 grid gap-3 text-sm"><label><input type="checkbox" checked={product.customizable} onChange={e=>update('customizable',e.target.checked)}/> Option personnalisation / logo</label><label><input type="checkbox" checked={product.featured} onChange={e=>update('featured',e.target.checked)}/> Mise en avant accueil</label><label><input type="checkbox" checked={product.newProduct} onChange={e=>update('newProduct',e.target.checked)}/> Nouveauté</label><label><input type="checkbox" checked={product.isPublished} onChange={e=>update('isPublished',e.target.checked)}/> Publier sur le site</label></div></aside></form></>}
export function CategoriesAdmin(){const [items,setItems]=useState([]);const [form,setForm]=useState({name:'',slug:'',description:'',isActive:true});const [saving,setSaving]=useState(false);const load=()=>getCategories({includeInactive:true}).then(setItems).catch(error=>toast.error(error.message));useEffect(()=>{load()},[]);const submit=async e=>{e.preventDefault();setSaving(true);try{await saveCategory({...form,slug:form.slug||slugify(form.name),image:null});toast.success('Catégorie enregistrée.');setForm({name:'',slug:'',description:'',isActive:true});load()}catch(error){toast.error(error.message)}finally{setSaving(false)}};const remove=async category=>{if(!window.confirm(`Supprimer la catégorie « ${category.name} » ?`))return;try{await deleteCategory(category.id);setItems(current=>current.filter(item=>item.id!==category.id));toast.success('Catégorie supprimée.')}catch(error){toast.error(error.message)}};return <><Title>Catégories</Title><div className="grid gap-6 lg:grid-cols-[360px_1fr]"><form onSubmit={submit} className="grid h-fit gap-4 bg-white p-6"><h2 className="font-display text-xl">Nouvelle catégorie</h2><label className="text-sm font-semibold">Nom<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-2 w-full border px-4 py-3"/></label><label className="text-sm font-semibold">Adresse<input value={form.slug} onChange={e=>setForm({...form,slug:slugify(e.target.value)})} placeholder={slugify(form.name)} className="mt-2 w-full border px-4 py-3"/></label><label className="text-sm font-semibold">Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows="3" className="mt-2 w-full border px-4 py-3"/></label><Button type="submit" disabled={saving}>{saving?'Enregistrement…':'Ajouter la catégorie'}</Button></form><div className="grid h-fit min-w-0 content-start items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(item=><article key={item.id} className="h-fit overflow-hidden bg-white"><div className="flex items-start justify-between gap-3 p-5"><div><b>{item.name}</b><p className="mt-1 text-xs text-black/45">/{item.slug}</p></div><button onClick={()=>remove(item)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-700 transition hover:bg-red-100" aria-label={`Supprimer ${item.name}`}><Trash2 className="h-4 w-4"/></button></div></article>)}</div></div></>}
export function OrdersAdmin(){const [rows,setRows]=useState([]);const [loading,setLoading]=useState(true);useEffect(()=>{getAdminOrders().then(setRows).catch(error=>toast.error(error.message)).finally(()=>setLoading(false))},[]);return <><Title>Commandes</Title><div className="bg-white p-6">{loading?<p className="py-10 text-center text-black/45">Chargement des commandes…</p>:<OrderTable rows={rows}/>}</div></>}
export function OrderDetail(){const {id}=useParams();const [order,setOrder]=useState(null);useEffect(()=>{getAdminOrders().then(rows=>setOrder(rows.find(item=>item.id===id)||null)).catch(error=>toast.error(error.message))},[id]);const changeStatus=async status=>{try{const updated=await updateOrderStatus(id,status);setOrder(current=>({...current,...updated}));toast.success('Statut mis à jour.')}catch(error){toast.error(error.message)}};return <><Title>Commande {order?.order_number||id}</Title><div className="grid gap-6 lg:grid-cols-3"><div className="bg-white p-6 lg:col-span-2"><h2 className="font-display text-xl">Détails de la commande</h2><div className="mt-6 divide-y border-y">{order?.order_items?.map(item=><div key={item.id} className="py-4"><b>{item.product_name||'Produit FOOD PACK'}</b><p className="text-sm text-black/50">Quantité {item.quantity}{item.size?` · Format ${item.size}`:''}{item.color?` · ${item.color}`:''}</p></div>)}</div><div className="mt-5 flex justify-between text-lg font-bold"><span>Total</span><span>{formatCurrency(order?.total||0)}</span></div></div><aside className="bg-white p-6"><h2 className="font-display text-xl">Client</h2><div className="mt-5 grid gap-2 text-sm"><b>{order?.customer_name}</b><span>{order?.phone}</span><span>{order?.city}</span>{order&&<Status>{orderStatus[order.status]||order.status}</Status>}</div>{order&&<label className="mt-6 block text-xs font-bold uppercase tracking-wider text-gold">Changer le statut<select value={order.status} onChange={e=>changeStatus(e.target.value)} className="mt-2 w-full border bg-white px-3 py-3 text-sm font-normal normal-case"><option value="new">Nouvelle</option><option value="confirmed">Confirmée</option><option value="in_progress">En préparation</option><option value="ready">Prête</option><option value="delivered">Livrée</option><option value="cancelled">Annulée</option></select></label>}{order?.phone&&<a href={`https://wa.me/${order.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"><Button className="mt-6 w-full">Ouvrir WhatsApp</Button></a>}</aside></div></>}
function LegacySimpleAdminPage({title,type}){const data=type==='gallery'?gallery:type==='testimonials'?testimonials:categories;return <><Title action={<Button><Plus className="h-4 w-4"/>Ajouter</Button>}>{title}</Title><div className="grid gap-4 md:grid-cols-3">{data.map((x,i)=><div key={x.id||x.slug||x.name} className="bg-white p-5">{x.image&&<img src={x.image} alt="" className="mb-4 h-36 w-full object-cover"/>}<b>{x.title||x.name||`Élément ${i+1}`}</b><p className="mt-2 line-clamp-2 text-sm text-black/50">{x.text||x.category||'Contenu administrable'}</p></div>)}</div></>}

const Field=({label,children})=><label className="text-sm font-semibold">{label}{children}</label>
const inputClass='mt-2 w-full rounded-xl border border-[#dfcfaa] bg-white px-4 py-3 outline-none focus:border-gold'

function LegacyCatalogDashboard(){
  const [data,setData]=useState(null)
  useEffect(()=>{getDashboardData().then(setData).catch(error=>toast.error(error.message))},[])
  if(!data)return <><Title>Tableau de bord</Title><p className="bg-white p-10 text-center text-black/45">Chargement des données…</p></>
  const cards=[[Package,'Produits',data.stats.products,'Articles au catalogue'],[ShoppingBag,'Commandes',data.stats.orders,'Depuis l’ouverture'],[Clock,'À traiter',data.stats.pending,'Commandes actives'],[Banknote,'Chiffre d’affaires',formatCurrency(data.stats.revenue),'Hors commandes annulées']]
  const counts=data.categories.map(category=>({...category,count:data.products.filter(product=>product.categoryId===category.id).length}))
  const maximum=Math.max(...counts.map(item=>item.count),1)
  return <><Title>Tableau de bord</Title><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([Icon,label,value,note])=><div key={label} className="relative overflow-hidden bg-white p-5"><div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#eadbb8]"/><span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-[#faf5ea] text-gold"><Icon className="h-5 w-5"/></span><p className="relative mt-5 text-xs text-black/45">{label}</p><b className="relative mt-1 block text-2xl">{value}</b><p className="relative mt-2 text-[10px] text-black/40">{note}</p></div>)}</div><div className="mt-6 grid min-w-0 max-w-full gap-6"><div className="dashboard-scroll min-w-0 overflow-x-auto overscroll-x-contain bg-white p-6 pb-3"><p className="text-[10px] font-bold uppercase tracking-wider text-gold">Catalogue réel</p><h2 className="mt-1 font-display text-xl">Produits par catégorie</h2><div className="mt-6 grid min-w-[1080px] gap-4 pb-2">{counts.map(item=><div key={item.id}><div className="mb-1.5 flex justify-between text-xs"><span>{item.name}</span><b>{item.count}</b></div><div className="h-2.5 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-gradient-to-r from-[#B38A2C] to-[#d7b65e]" style={{width:`${item.count/maximum*100}%`}}/></div></div>)}</div></div><div className="bg-white p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-wider text-gold">À suivre</p><h2 className="mt-1 font-display text-xl">Commandes récentes</h2></div><Link to="/admin/commandes" className="text-xs font-semibold text-gold">Voir toutes</Link></div><OrderTable rows={data.orders.slice(0,5)}/></div></div></>
}

function GalleryAdmin(){
  const empty={title:'',category:'',sortOrder:0,isPublished:true,mediaType:'image'}
  const [items,setItems]=useState([]),[form,setForm]=useState(empty),[file,setFile]=useState(null),[saving,setSaving]=useState(false)
  const load=()=>getGallery({includeDrafts:true}).then(setItems).catch(error=>toast.error(error.message))
  useEffect(()=>{load()},[])
  const submit=async event=>{event.preventDefault();setSaving(true);try{await saveGalleryItem(form,file);toast.success(form.id?'Réalisation modifiée.':'Réalisation ajoutée.');setForm(empty);setFile(null);load()}catch(error){toast.error(error.message)}finally{setSaving(false)}}
  const remove=async item=>{if(!window.confirm(`Supprimer « ${item.title} » ?`))return;try{await deleteGalleryItem(item.id);load();toast.success('Réalisation supprimée.')}catch(error){toast.error(error.message)}}
  return <><Title>Galerie</Title><div className="grid gap-6 lg:grid-cols-[360px_1fr]"><form onSubmit={submit} className="grid h-fit gap-4 bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-display text-xl">{form.id?'Modifier':'Nouvelle réalisation'}</h2>{form.id&&<button type="button" onClick={()=>{setForm(empty);setFile(null)}}><X className="h-5 w-5"/></button>}</div><Field label="Titre"><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className={inputClass}/></Field><Field label="Catégorie"><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={inputClass}/></Field><Field label="Ordre d’affichage"><input type="number" min="0" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:e.target.value})} className={inputClass}/></Field><Field label="Photo ou vidéo"><input required={!form.image} type="file" accept="image/*,video/mp4,video/webm,video/quicktime" onChange={e=>setFile(e.target.files[0])} className="mt-2 block w-full text-xs"/><span className="mt-2 block text-[10px] font-normal text-black/40">JPG, PNG, WebP, MP4, WebM ou MOV · 50 Mo maximum</span></Field><label className="text-sm"><input type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form,isPublished:e.target.checked})}/> Afficher dans la galerie</label><Button type="submit" disabled={saving}>{saving?'Enregistrement…':form.id?'Enregistrer':'Ajouter'}</Button></form><div className="grid h-fit min-w-0 content-start items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(item=><article key={item.id} className="h-fit overflow-hidden bg-white">{item.mediaType==='video'?<video src={item.image} controls muted playsInline preload="metadata" className="h-48 w-full bg-black object-contain"/>:<img src={item.image} alt={item.title} className="h-48 w-full object-cover"/>}<div className="p-4"><div className="flex justify-between gap-3"><div><b>{item.title}</b><p className="text-xs text-black/45">{item.category||'Sans catégorie'} · {item.mediaType==='video'?'Vidéo':'Photo'} · {item.isPublished?'Publié':'Masqué'}</p></div><div className="flex gap-2"><button onClick={()=>{setForm(item);setFile(null)}} className="text-gold"><Pencil className="h-4 w-4"/></button><button onClick={()=>remove(item)} className="text-red-700"><Trash2 className="h-4 w-4"/></button></div></div></div></article>)}{!items.length&&<p className="text-sm text-black/45">Aucune réalisation. Ajoutez la première photo ou vidéo.</p>}</div></div></>
}

function TestimonialsAdmin(){
  const empty={name:'',city:'',text:'',sortOrder:0,isPublished:true}
  const [items,setItems]=useState([]),[form,setForm]=useState(empty),[saving,setSaving]=useState(false)
  const load=()=>getTestimonials({includeDrafts:true}).then(setItems).catch(error=>toast.error(error.message))
  useEffect(()=>{load()},[])
  const submit=async event=>{event.preventDefault();setSaving(true);try{await saveTestimonial(form);toast.success(form.id?'Témoignage modifié.':'Témoignage ajouté.');setForm(empty);load()}catch(error){toast.error(error.message)}finally{setSaving(false)}}
  const remove=async item=>{if(!window.confirm(`Supprimer le témoignage de ${item.name} ?`))return;try{await deleteTestimonial(item.id);load();toast.success('Témoignage supprimé.')}catch(error){toast.error(error.message)}}
  return <><Title>Témoignages</Title><div className="grid gap-6 lg:grid-cols-[360px_1fr]"><form onSubmit={submit} className="grid h-fit gap-4 bg-white p-6"><div className="flex justify-between"><h2 className="font-display text-xl">{form.id?'Modifier':'Nouveau témoignage'}</h2>{form.id&&<button type="button" onClick={()=>setForm(empty)}><X className="h-5 w-5"/></button>}</div><Field label="Nom du client / Établissement"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={inputClass}/></Field><Field label="Ville"><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className={inputClass}/></Field><Field label="Témoignage"><textarea required rows="5" value={form.text} onChange={e=>setForm({...form,text:e.target.value})} className={inputClass}/></Field><Field label="Ordre"><input type="number" min="0" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:e.target.value})} className={inputClass}/></Field><label className="text-sm"><input type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form,isPublished:e.target.checked})}/> Publier sur le site</label><Button type="submit" disabled={saving}>{saving?'Enregistrement…':form.id?'Enregistrer':'Ajouter'}</Button></form><div className="grid gap-4 md:grid-cols-2">{items.map(item=><blockquote key={item.id} className="bg-white p-6"><p className="font-display text-xl">« {item.text} »</p><footer className="mt-4 text-xs text-black/50">{item.name}{item.city?` — ${item.city}`:''} · {item.isPublished?'Publié':'Masqué'}</footer><div className="mt-4 flex gap-3"><button onClick={()=>setForm(item)} className="text-gold"><Pencil className="h-4 w-4"/></button><button onClick={()=>remove(item)} className="text-red-700"><Trash2 className="h-4 w-4"/></button></div></blockquote>)}{!items.length&&<p className="text-sm text-black/45">Aucun témoignage enregistré.</p>}</div></div></>
}

function ContentAdmin(){
  const defaults={
    hero:{eyebrow:'Pour professionnels & particuliers',title:'L’emballage qui met vos produits en valeur.',description:'Boîtes, gobelets, sacs, pots et accessoires alimentaires sélectionnés pour emballer, protéger et servir avec soin.',primaryButton:'Voir le catalogue',secondaryButton:'Demander un devis'},
    homeIntro:{eyebrow:'Votre partenaire emballage',title:'Tout ce qu’il faut pour vendre à emporter, au même endroit.',description:'Foodpack by MB accompagne restaurants, traiteurs, pâtissiers, commerces et organisateurs d’événements avec des formats adaptés à chaque usage.'},
    homeProducts:{eyebrow:'Les indispensables',title:'Nos meilleures ventes',button:'Explorer tout le catalogue'},
    homeGallery:{eyebrow:'Des solutions pour chaque métier',title:'Un format pour chaque préparation',description:'Repas chauds, boissons, salades ou pâtisseries : trouvez rapidement l’emballage adapté à votre activité.',button:'Découvrir nos solutions'},
    homeStory:{eyebrow:'Pensé pour votre quotidien',title:'Bien emballer, c’est déjà bien servir.',description:'Nous choisissons des emballages faciles à stocker, rapides à utiliser et suffisamment solides pour accompagner vos produits jusqu’à vos clients.',button:'Découvrir Foodpack'},
    homeFaq:{eyebrow:'Questions fréquentes',title:'Tout savoir avant de commander'},
    homeCta:{title:'Besoin d’un volume ou d’un format particulier ?',button:'Demander un devis'},
    collection:{eyebrow:'Tout pour emballer et servir',title:'Le catalogue',description:'Découvrez nos emballages pour repas, boissons, pâtisseries et vente à emporter, disponibles en lots.'},
    galleryPage:{eyebrow:'À chaque usage sa solution',title:'Nos emballages en situation'},
    about:{eyebrow:'Qui sommes-nous ?',title:'Des emballages qui simplifient votre quotidien.',description:'Foodpack by MB rend les emballages alimentaires fiables et soignés plus accessibles aux professionnels comme aux particuliers.',sectionTitle:'Le bon format, au bon moment',sectionText:'Nous sélectionnons des solutions adaptées à la restauration, la pâtisserie, la vente à emporter et l’événementiel.',image:''},
    contact:{eyebrow:'Parlons de vos besoins',title:'Une question ou un devis ?',description:'Indiquez-nous les produits, formats et quantités recherchés. Nous vous répondrons rapidement.',button:'Envoyer sur WhatsApp'},
    faqPage:{title:'Questions fréquentes'},
    footer:{eyebrow:'Votre partenaire emballage à Cotonou',description:'Des emballages alimentaires fiables et soignés pour la restauration, la pâtisserie, les événements et la vente à emporter.'},
  }
  const tabs=[['home','Accueil'],['catalog','Collection & galerie'],['about','À propos'],['contact','Contact & pied de page'],['legal','Pages légales']]
  const sectionsByTab={home:['hero','homeIntro','homeProducts','homeGallery','homeStory','homeFaq','homeCta'],catalog:['collection','galleryPage'],about:['about'],contact:['contact','faqPage','footer']}
  const sectionTitles={hero:'Hero principal',homeIntro:'Introduction',homeProducts:'Produits mis en avant',homeGallery:'Galerie sur l’accueil',homeStory:'Présentation de l’atelier',homeFaq:'Bloc questions fréquentes',homeCta:'Appel à l’action',collection:'Page collection',galleryPage:'Page galerie',about:'Page À propos',contact:'Page contact',faqPage:'Page FAQ',footer:'Pied de page'}
  const fieldLabels={eyebrow:'Petit titre',title:'Titre',description:'Description',primaryButton:'Bouton principal',secondaryButton:'Second bouton',button:'Texte du bouton',sectionTitle:'Titre de la seconde section',sectionText:'Texte de la seconde section'}
  const legalDefaults={privacy:{body:'Foodpack by MB collecte uniquement les informations nécessaires au traitement des commandes et des demandes.'},terms:{body:'Toute commande est confirmée après validation des références, quantités, prix et modalités de livraison.'},delivery:{body:'Les délais et frais de livraison dépendent de la destination et sont confirmés avant l’expédition.'},legal:{body:'Le présent site est édité par Foodpack by MB.'}}
  const [content,setContent]=useState({...defaults,...legalDefaults}),[saving,setSaving]=useState(false),[activeTab,setActiveTab]=useState('home'),[aboutFile,setAboutFile]=useState(null)
  useEffect(()=>{getSiteContent().then(data=>setContent(current=>({...current,...data}))).catch(error=>toast.error(error.message))},[])
  const update=(section,key,value)=>setContent(current=>({...current,[section]:{...current[section],[key]:value}}))
  const submit=async event=>{event.preventDefault();setSaving(true);try{let next=content;if(aboutFile){if(!aboutFile.type.startsWith('image/'))throw new Error('La photo À propos doit être une image.');const image=await uploadCatalogImage(aboutFile,'content');next={...content,about:{...content.about,image}};setContent(next);setAboutFile(null)}const keys=activeTab==='legal'?['privacy','terms','delivery','legal']:sectionsByTab[activeTab];await Promise.all(keys.map(key=>saveSiteContent(key,next[key])));toast.success('Contenus enregistrés.')}catch(error){toast.error(error.message)}finally{setSaving(false)}}
  const renderFields=section=>Object.entries(content[section]||{}).filter(([key])=>key!=='image'&&key!=='body').map(([key,value])=><Field key={key} label={fieldLabels[key]||key}>{['description','sectionText'].includes(key)?<textarea rows="4" value={value||''} onChange={e=>update(section,key,e.target.value)} className={inputClass}/>:<input value={value||''} onChange={e=>update(section,key,e.target.value)} className={inputClass}/>}</Field>)
  return <><Title>Contenus</Title><div className="dashboard-scroll mb-6 max-w-full overflow-x-auto"><div className="flex min-w-max gap-2">{tabs.map(([id,label])=><button key={id} type="button" onClick={()=>setActiveTab(id)} className={`rounded-full px-5 py-3 text-xs font-bold transition ${activeTab===id?'bg-gold text-white':'bg-white text-black/60 hover:text-gold'}`}>{label}</button>)}</div></div><form onSubmit={submit} className="grid gap-6">{activeTab==='legal'?[['privacy','Politique de confidentialité'],['terms','Conditions générales'],['delivery','Livraison et retours'],['legal','Mentions légales']].map(([key,title])=><section key={key} className="grid gap-4 bg-white p-6"><h2 className="font-display text-xl">{title}</h2><Field label="Contenu"><textarea rows="10" value={content[key]?.body||''} onChange={e=>update(key,'body',e.target.value)} className={inputClass}/></Field></section>):sectionsByTab[activeTab].map(section=><section key={section} className="grid gap-4 bg-white p-6"><h2 className="font-display text-xl">{sectionTitles[section]}</h2>{renderFields(section)}{section==='about'&&<><Field label="Photo de présentation FOOD PACK"><input type="file" accept="image/*" onChange={e=>setAboutFile(e.target.files?.[0]||null)} className={inputClass}/></Field>{content.about.image&&<img src={content.about.image} alt="Aperçu À propos" className="max-h-72 w-full rounded-2xl object-cover"/>}</>}</section>)}<Button type="submit" disabled={saving}>{saving?'Enregistrement…':'Enregistrer cet onglet'}</Button></form></>
}

function SettingsAdmin(){
  const [form,setForm]=useState(null),[saving,setSaving]=useState(false)
  useEffect(()=>{getSiteSettings().then(setForm).catch(error=>toast.error(error.message))},[])
  if(!form)return <><Title>Paramètres</Title><p className="bg-white p-10 text-center">Chargement…</p></>
  const submit=async event=>{event.preventDefault();setSaving(true);try{setForm(await saveSiteSettings(form));toast.success('Paramètres enregistrés.')}catch(error){toast.error(error.message)}finally{setSaving(false)}}
  const fields=[['shop_name','Nom court'],['full_name','Nom complet'],['whatsapp','Numéro WhatsApp'],['phone','Téléphone'],['email','E-mail public'],['address','Adresse'],['instagram','Lien Instagram'],['facebook','Lien Facebook'],['pinterest','Lien Pinterest']]
  return <><Title>Paramètres</Title><form onSubmit={submit} className="grid max-w-3xl gap-5 bg-white p-6 sm:grid-cols-2">{fields.map(([key,label])=><Field key={key} label={label}>{['phone','whatsapp'].includes(key)?<PhoneInput value={form[key]||''} onChange={value=>setForm({...form,[key]:value})}/>:<input required={['shop_name','full_name'].includes(key)} type={key==='email'?'email':'text'} value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})} className={inputClass}/>}</Field>)}<Field label="Frais de livraison (FCFA)"><input type="number" min="0" value={form.delivery_fee||0} onChange={e=>setForm({...form,delivery_fee:e.target.value})} className={inputClass}/></Field><div className="sm:col-span-2"><Button type="submit" disabled={saving}>{saving?'Enregistrement…':'Enregistrer les paramètres'}</Button></div></form></>
}

function ProfileAdmin(){
  const [profile,setProfile]=useState(null),[password,setPassword]=useState(''),[confirmation,setConfirmation]=useState(''),[saving,setSaving]=useState(false)
  useEffect(()=>{getAdminProfile().then(setProfile).catch(error=>toast.error(error.message))},[])
  if(!profile)return <><Title>Profil</Title><p className="bg-white p-10 text-center">Chargement…</p></>
  const submit=async event=>{event.preventDefault();setSaving(true);try{const current=await getAdminProfile();const nextProfile=await saveAdminProfile(profile.full_name);if(profile.email.trim().toLowerCase()!==current.email?.toLowerCase()){await updateAdminEmail(profile.email);toast.success('Un lien de confirmation peut être envoyé à la nouvelle adresse e-mail.')}if(password){if(password.length<8)throw new Error('Le mot de passe doit contenir au moins 8 caractères.');if(password!==confirmation)throw new Error('Les mots de passe ne correspondent pas.');await updateAdminPassword(password);setPassword('');setConfirmation('')}setProfile({...nextProfile,email:profile.email.trim().toLowerCase()});toast.success('Profil administrateur mis à jour.')}catch(error){toast.error(error.message)}finally{setSaving(false)}}
  return <><Title>Profil administrateur</Title><form onSubmit={submit} className="grid max-w-xl gap-5 bg-white p-6"><Field label="Nom complet"><input required value={profile.full_name||''} onChange={e=>setProfile({...profile,full_name:e.target.value})} className={inputClass}/></Field><Field label="E-mail de connexion"><input required type="email" autoComplete="email" value={profile.email||''} onChange={e=>setProfile({...profile,email:e.target.value})} className={inputClass}/><span className="mt-2 block text-[10px] font-normal leading-5 text-black/45">Supabase peut demander une confirmation sur l’ancienne et la nouvelle adresse.</span></Field><div className="border-t border-gold/15 pt-5"><p className="mb-4 text-xs font-bold uppercase tracking-wider text-gold">Changer le mot de passe</p><div className="grid gap-5"><Field label="Nouveau mot de passe (facultatif)"><input type="password" minLength="8" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="8 caractères minimum" className={inputClass}/></Field><Field label="Confirmer le nouveau mot de passe"><input type="password" minLength="8" autoComplete="new-password" value={confirmation} onChange={e=>setConfirmation(e.target.value)} placeholder="Saisir le même mot de passe" className={inputClass}/></Field></div></div><Button type="submit" disabled={saving}>{saving?'Enregistrement…':'Mettre à jour le profil'}</Button></form></>
}

function LegalContentAdmin(){
  const defaults={
    privacy:{body:'Données collectées\nFOOD PACK collecte uniquement les informations nécessaires au traitement des commandes et des demandes de devis : nom, coordonnées, adresse de livraison et détails de la commande.\n\nUtilisation et conservation\nCes données servent à préparer la commande, contacter le client et organiser la livraison. Elles ne sont ni cédées ni utilisées à d’autres fins.\n\nVos droits\nVous pouvez demander l’accès, la modification ou la suppression de vos coordonnées en écrivant à contact@foodpack.com ou par WhatsApp.'},
    terms:{body:'Commandes\nToute commande est confirmée après validation des références, volumes, formats, prix et modalités de livraison avec FOOD PACK.\n\nPrix et facturation\nLes prix sont affichés en FCFA (XOF). Des tarifs dégressifs par carton ou palette sont appliqués pour les professionnels sur devis préalable.\n\nDisponibilité et conformité\nNos emballages sont certifiés pour un contact alimentaire sûr (bouteilles PET, boîtes kraft étanches, gobelets). Les stocks sont actualisés en temps réel.\n\nLivraison et réclamations\nLes livraisons sont assurées dans Cotonou, Calavi et expédiées dans tout le Bénin. Toute non-conformité constatée à la réception doit être signalée immédiatement avec photo à l’appui.'},
    delivery:{body:'Zones de livraison\nLivraison express en 24h/48h à Cotonou et Abomey-Calavi. Expéditions vers les autres villes du Bénin (Porto-Novo, Parakou, Bohicon, Ouidah...) via compagnies de transport et gares.\n\nFrais de livraison\nLes frais s’appliquent selon le lieu de livraison et sont confirmés lors de la commande.\n\nRetours et échanges\nEn raison des normes d’hygiène alimentaire, les emballages ouverts ou descellés ne peuvent être repris sauf défaut avéré de fabrication.'},
    legal:{body:'Éditeur du site\nLe présent site est édité par FOOD PACK, boutique spécialisée dans la vente d’emballages alimentaires, bouteilles de jus et boîtes kraft à Cotonou, Bénin.\n\nContact\nE-mail : contact@foodpack.com\n\nPropriété intellectuelle\nL’ensemble des contenus, marques, logos et visuels présents sur FOOD PACK sont protégés.'},
  }
  const [legal,setLegal]=useState(defaults),[saving,setSaving]=useState(false)
  useEffect(()=>{getSiteContent().then(data=>setLegal({privacy:data.privacy||defaults.privacy,terms:data.terms||defaults.terms,delivery:data.delivery||defaults.delivery,legal:data.legal||defaults.legal})).catch(error=>toast.error(error.message))},[])
  const submit=async event=>{event.preventDefault();setSaving(true);try{await Promise.all(Object.entries(legal).map(([key,value])=>saveSiteContent(key,value)));toast.success('Pages légales enregistrées.')}catch(error){toast.error(error.message)}finally{setSaving(false)}}
  const sections=[['privacy','Politique de confidentialité'],['terms','Conditions générales'],['delivery','Livraison et retours'],['legal','Mentions légales']]
  return <form onSubmit={submit} className="mt-6 grid gap-6">{sections.map(([key,title])=><section key={key} className="bg-white p-6"><h2 className="font-display text-xl">{title}</h2><Field label="Contenu"><textarea required rows="9" value={legal[key].body} onChange={e=>setLegal(current=>({...current,[key]:{body:e.target.value}}))} className={inputClass}/></Field></section>)}<Button type="submit" disabled={saving}>{saving?'Enregistrement…':'Enregistrer les pages légales'}</Button></form>
}

export function SimpleAdminPage({title,type}){
  if(type==='gallery')return <GalleryAdmin/>
  if(type==='testimonials')return <TestimonialsAdmin/>
  if(title==='Contenus')return <ContentAdmin/>
  if(title==='Paramètres')return <SettingsAdmin/>
  if(title==='Profil')return <ProfileAdmin/>
  return <><Title>{title}</Title><p className="bg-white p-10">Cette section est prête.</p></>
}

function CatalogDashboard() {
  const [data, setData] = useState(null)
  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch((error) => {
        console.error('Erreur getDashboardData:', error)
        toast.error(error.message)
        setData({
          products: [],
          orders: [],
          categories: [],
          stats: { products: 0, orders: 0, pending: 0, revenue: 0 },
        })
      })
  }, [])

  if (!data) {
    return (
      <>
        <Title>Tableau de bord</Title>
        <p className="max-w-full bg-white p-10 text-center text-black/45">Chargement des données…</p>
      </>
    )
  }

  const stats = data.stats || { products: 0, orders: 0, pending: 0, revenue: 0 }
  const categoriesList = Array.isArray(data.categories) ? data.categories : []
  const productsList = Array.isArray(data.products) ? data.products : []
  const ordersList = Array.isArray(data.orders) ? data.orders : []

  const cards = [
    [Package, 'Produits', stats.products ?? productsList.length, 'Articles au catalogue'],
    [ShoppingBag, 'Commandes', stats.orders ?? ordersList.length, 'Depuis l’ouverture'],
    [Clock, 'À traiter', stats.pending ?? 0, 'Commandes actives'],
    [Banknote, 'Chiffre d’affaires', formatCurrency(stats.revenue ?? 0), 'Hors commandes annulées'],
  ]

  const counts = categoriesList.map((category) => ({
    ...category,
    count: productsList.filter((product) => product.categoryId === category.id).length,
  }))
  const maximum = Math.max(...counts.map((item) => item.count), 1)

  return (
    <>
      <Title>Tableau de bord</Title>
      <div className="grid max-w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([Icon, label, value, note]) => (
          <div key={label} className="relative min-w-0 overflow-hidden bg-white p-5">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#eadbb8]" />
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-[#faf5ea] text-gold">
              <Icon className="h-5 w-5" />
            </span>
            <p className="relative mt-5 text-xs text-black/45">{label}</p>
            <b className="relative mt-1 block text-2xl">{value}</b>
            <p className="relative mt-2 text-[10px] text-black/40">{note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid min-w-0 max-w-full gap-6">
        <section className="min-w-0 max-w-full overflow-hidden bg-white p-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold">Catalogue réel</p>
          <h2 className="mt-1 font-display text-xl">Produits par catégorie</h2>
          <div className="dashboard-scroll mt-6 w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-3">
            <div className="grid min-w-[760px] gap-4">
              {counts.map((item) => (
                <div key={item.id} className="min-w-0">
                  <div className="mb-1.5 flex justify-between gap-4 text-xs">
                    <span>{item.name}</span>
                    <b className="shrink-0">{item.count}</b>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-mist">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#B38A2C] to-[#d7b65e]"
                      style={{ width: `${(item.count / maximum) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {!counts.length && (
                <p className="py-6 text-center text-xs text-black/45">Aucune catégorie pour le moment.</p>
              )}
            </div>
          </div>
        </section>

        <section className="min-w-0 max-w-full overflow-hidden bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold">À suivre</p>
              <h2 className="mt-1 font-display text-xl">Commandes récentes</h2>
            </div>
            <Link to="/admin/commandes" className="shrink-0 text-xs font-semibold text-gold">
              Voir toutes
            </Link>
          </div>
          <div className="w-full min-w-0 max-w-full overflow-hidden">
            <OrderTable rows={ordersList.slice(0, 5)} />
          </div>
        </section>
      </div>
    </>
  )
}

function TrafficPanel() {
  const [traffic, setTraffic] = useState({ total: 0, visitors: 0, today: 0, daily: [], topPages: [] })
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(false)

  const load = (days) => {
    setLoading(true)
    getTrafficStats(days)
      .then((data) => {
        setTraffic({
          total: data?.total || 0,
          visitors: data?.visitors || 0,
          today: data?.today || 0,
          daily: Array.isArray(data?.daily) ? data.daily : [],
          topPages: Array.isArray(data?.topPages) ? data.topPages : [],
        })
      })
      .catch((error) => {
        if (error?.code !== '42P01') toast.error(error.message)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(period)
  }, [period])

  const dailyList = Array.isArray(traffic?.daily) ? traffic.daily : []
  const topPagesList = Array.isArray(traffic?.topPages) ? traffic.topPages : []
  const maximum = Math.max(...dailyList.map((item) => item.count), 1)

  const pageName = (path) => {
    const clean = decodeURIComponent(path || '').replace(/\/+$/, '') || '/'
    const fixed = {
      '/': 'Accueil',
      '/collections': 'Collection',
      '/galerie': 'Galerie',
      '/a-propos': 'À propos',
      '/contact': 'Contact',
      '/panier': 'Panier',
      '/commande': 'Finalisation de commande',
      '/faq': 'Questions fréquentes',
      '/conditions-generales': 'Conditions générales',
      '/politique-de-confidentialite': 'Confidentialité',
      '/mentions-legales': 'Mentions légales',
      '/livraison-et-retours': 'Livraison et retours',
    }
    if (fixed[clean]) return fixed[clean]
    if (clean.startsWith('/categories/')) return `Catégorie : ${clean.split('/').pop().replaceAll('-', ' ')}`
    if (clean.startsWith('/collections/')) return `Produit : ${clean.split('/').pop().replaceAll('-', ' ')}`
    return clean.replaceAll('-', ' ').replaceAll('/', ' ').trim()
  }

  const periodLabel = period ? `${period} derniers jours` : 'toute la période'

  return (
    <section className="mt-6 min-w-0 overflow-hidden bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold">Trafic · {periodLabel}</p>
          <h2 className="mt-1 font-display text-xl">Visiteurs du site</h2>
        </div>
        <div className="flex max-w-full flex-wrap gap-2">
          {[3, 7, 30, null].map((days) => (
            <button
              key={days ?? 'all'}
              onClick={() => setPeriod(days)}
              className={`rounded-full px-3 py-2 text-[10px] font-bold transition ${
                period === days ? 'bg-gold text-white' : 'bg-mist text-gold'
              }`}
            >
              {days ? `${days} jours` : 'Tout'}
            </button>
          ))}
          <button
            onClick={() => setPeriod(30)}
            className="rounded-full border border-gold/25 px-3 py-2 text-[10px] font-bold text-gold"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-lg sm:gap-4">
        {[
          [Users, 'Visiteurs', traffic?.visitors || 0],
          [MousePointerClick, 'Pages vues', traffic?.total || 0],
          [Clock, 'Aujourd’hui', traffic?.today || 0],
        ].map(([Icon, label, value]) => (
          <div key={label} className="min-w-0 rounded-2xl bg-mist p-3 text-center sm:p-4">
            <Icon className="mx-auto h-4 w-4 text-gold" />
            <b className="mt-1 block truncate text-xl">{value}</b>
            <small className="block truncate text-[9px] sm:text-xs">{label}</small>
          </div>
        ))}
      </div>

      <div className="dashboard-scroll mt-8 min-w-0 overflow-x-auto overscroll-x-contain pb-3">
        <div
          className="grid h-40 min-w-[1080px] items-end gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.max(dailyList.length, 1)}, minmax(0, 1fr))` }}
        >
          {dailyList.map((item) => (
            <div
              key={item.date}
              title={`${new Date(item.date).toLocaleDateString('fr-FR')} : ${item.count} vue(s)`}
              className="group relative min-w-0 rounded-t bg-gradient-to-t from-[#B38A2C] to-[#d9bd73]"
              style={{ height: `${Math.max(8, (item.count / maximum) * 100)}%` }}
            >
              <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 text-[9px] font-bold group-hover:block">
                {item.count}
              </span>
            </div>
          ))}
          {!dailyList.length && (
            <p className="col-span-full m-auto text-center text-sm text-black/40">
              {loading ? 'Chargement…' : 'Aucune visite enregistrée pour cette période.'}
            </p>
          )}
        </div>
      </div>

      <div className="mt-7">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gold">Pages les plus visitées</h3>
        <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {topPagesList.map((item) => (
            <div key={item.path} className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-mist px-3 py-3 text-xs">
              <span className="min-w-0 truncate capitalize" title={pageName(item.path)}>
                {pageName(item.path)}
              </span>
              <b className="shrink-0 text-gold">{item.count}</b>
            </div>
          ))}
          {!topPagesList.length && <p className="text-xs text-black/40">Aucune page visitée.</p>}
        </div>
      </div>
    </section>
  )
}

export function DashboardPage(){
  return <><CatalogDashboard/><TrafficPanel/></>
}

export function ForgotPasswordPage(){
  const [email,setEmail]=useState(''),[sent,setSent]=useState(false),[loading,setLoading]=useState(false)
  const submit=async event=>{event.preventDefault();setLoading(true);const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/admin/reinitialiser`});setLoading(false);if(error)return toast.error(error.message);setSent(true)}
  return <div className="grid min-h-screen place-items-center bg-mist p-5"><form onSubmit={submit} className="w-full max-w-md bg-white p-8"><p className="text-[10px] font-bold uppercase tracking-wider text-gold">Administration</p><h1 className="mt-2 font-display text-3xl">Mot de passe oublié</h1>{sent?<><p className="mt-5 leading-7 text-black/55">Si cette adresse correspond au compte administrateur, un lien de réinitialisation vient d’être envoyé.</p><Button to="/admin/connexion" className="mt-6 w-full">Retour à la connexion</Button></>:<><p className="mt-4 text-sm leading-6 text-black/55">Saisissez l’adresse e-mail du compte administrateur.</p><Field label="Adresse e-mail"><input required type="email" value={email} onChange={event=>setEmail(event.target.value)} className={inputClass}/></Field><Button type="submit" disabled={loading} className="mt-6 w-full">{loading?'Envoi…':'Envoyer le lien sécurisé'}</Button><Link to="/admin/connexion" className="mt-5 block text-center text-xs text-gold">Retour à la connexion</Link></>}</form></div>
}

export function ResetPasswordPage(){
  const [password,setPassword]=useState(''),[confirmation,setConfirmation]=useState(''),[saving,setSaving]=useState(false)
  const submit=async event=>{event.preventDefault();if(password.length<8)return toast.error('Utilisez au moins 8 caractères.');if(password!==confirmation)return toast.error('Les mots de passe ne correspondent pas.');setSaving(true);const {error}=await supabase.auth.updateUser({password});setSaving(false);if(error)return toast.error(error.message);toast.success('Mot de passe mis à jour.');window.location.replace('/admin')}
  return <div className="grid min-h-screen place-items-center bg-mist p-5"><form onSubmit={submit} className="w-full max-w-md bg-white p-8"><p className="text-[10px] font-bold uppercase tracking-wider text-gold">Lien sécurisé</p><h1 className="mt-2 font-display text-3xl">Nouveau mot de passe</h1><div className="mt-6 grid gap-5"><Field label="Nouveau mot de passe"><input required minLength="8" type="password" value={password} onChange={event=>setPassword(event.target.value)} className={inputClass}/></Field><Field label="Confirmer le mot de passe"><input required minLength="8" type="password" value={confirmation} onChange={event=>setConfirmation(event.target.value)} className={inputClass}/></Field></div><Button type="submit" disabled={saving} className="mt-6 w-full">{saving?'Enregistrement…':'Enregistrer le mot de passe'}</Button></form></div>
}

export function AuditLogPage(){
  const [logs,setLogs]=useState([]),[loading,setLoading]=useState(true)
  useEffect(()=>{getAuditLogs().then(setLogs).catch(error=>toast.error(error.message)).finally(()=>setLoading(false))},[])
  const labels={products:'Produits',categories:'Catégories',gallery_items:'Galerie',testimonials:'Témoignages',site_content:'Contenus',site_settings:'Paramètres'}
  const actions={INSERT:'Création',UPDATE:'Modification',DELETE:'Suppression'}
  return <><Title>Journal de sécurité</Title><div className="min-w-0 max-w-full overflow-hidden bg-white p-6"><p className="text-sm text-black/50">Les 200 dernières actions sensibles réalisées dans l’administration.</p>{loading?<p className="py-10 text-center">Chargement…</p>:<div className="dashboard-scroll mt-6 max-w-full overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr><th className="pb-3">Date</th><th className="pb-3">Action</th><th className="pb-3">Section</th><th className="pb-3">Élément</th><th className="pb-3">Administrateur</th></tr></thead><tbody>{logs.map(log=><tr key={log.id} className="border-t"><td className="whitespace-nowrap py-4">{new Date(log.occurred_at).toLocaleString('fr-FR')}</td><td>{actions[log.action]||log.action}</td><td>{labels[log.table_name]||log.table_name}</td><td>{log.record_id||'—'}</td><td className="font-mono text-xs">{log.admin_id?.slice(0,8)||'Système'}</td></tr>)}{!logs.length&&<tr><td colSpan="5" className="py-10 text-center text-black/45">Aucune action enregistrée pour le moment.</td></tr>}</tbody></table></div>}</div></>
}

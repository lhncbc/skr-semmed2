package gov.nih.nlm.semmed.servlet;

import java.io.BufferedWriter; 
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import javax.naming.Context;  
import javax.naming.InitialContext;  
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.*;
import javax.servlet.*;
import javax.naming.NamingException;
import java.sql.SQLException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ArrayList; 
import java.util.Map;
import java.util.UUID;
import java.util.Map.Entry;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Cookie;
import javax.sql.DataSource;

import org.json.*;

/**
 *
 * @author shindongwoo
 *
 */
public class SemMedDBServlet30SearchTest extends HttpServlet { 

	private static final long serialVersionUID = 1L;
	private static Log log = LogFactory.getLog(SemMedDBServlet30SearchTest.class);

	private DataSource ds;

	private String qryTemp = new String("select PREDICATION_ID, SENTENCE_ID, PMID, PREDICATE, SUBJECT_CUI, SUBJECT_NAME, SUBJECT_SEMTYPE, SUBJECT_NOVELTY, OBJECT_CUI, OBJECT_NAME, OBJECT_SEMTYPE, OBJECT_NOVELTY from PREDICATION where PMID in ($1) limit 50000");
	private String qry2Temp = new String("select * from SENTENCE where PMID in ($1) order by PMID, TYPE desc, NUMBER");
	private String qry3Temp = new String("select * from SENTENCE where SENTENCE_ID in ($1) order by PMID, NUMBER");

	 private String list1010 = new String("'28650441','28641579','28630875','28629398','28620836','28612394','28608950','28608355','28605477','28602979','28596941','28594935','28573184','28570014','28566332','28549626','28547002','28541444','28536012','28534507','28531337','28529561','28529551','28524099','28512646','28507806','28506076','28497804','28490949','28488122','28482428','28480325','28478595','28476779','28476618','28475775','28465358','28461570','28461156','28459461','28453746','28447277','28445977','28442918','28441372','28434112','28418388','28415577','28411277','28410300','28403532','28389997','28388955','28388425','28388423','28387849','28387831','28387596','28381315','28371827','28367602','28362548','28357913','28352319','28349351','28347245','28346426','28341197','28339582','28319049','28319047','28318896','28318492','28317871','28316990','28303490','28302022','28299344','28292436','28287634','28286975','28284350','28283885','28283580','28278424','28274139','28258696','28258545','28234621','28233371','28230277','28208677','28197373','28194092','28184256','28179106','28173797','28169355','28153049','20301355','28135256','28129117','28123880','28116121','28115470','28111040','28109979','28109751','28107450','28101577','28093702','28089910','28089821','28076333','28073370','28063055','28030801','28029927','28025034','28019039','28017775','28011470','28003994','28002799','28001089','28000537','28000534','27999734','27995487','27993092','27989218','27964820','27960088','27959794','27942918','27942839','27934069','27903982','27879135','27876012','27875627','27867916','27858578','27835870','27835581','27831762','27824081','27822377','27816892','27814616','27777083','27792139','27783195','27781030','27666391','27765835','27756892','27618552','27576783','27472224','27748906','27743144','27738332','27737869','27713134','27698917','27697289','27688162','27663389','27660268','27631626','27622606','27598146','27593826','27584058','27579489','27577073','27573705','27565396','27562399','27560502','27546018','27528361','27515027','27510663','27493076','27485481','27485078','27482758','27472461','27471637','27463676','27460064','27453950','27450763','27434205','27427982','27415034','27399534','27397086','27379831','27374287','27370400','27358487','27356688','27356059','27334978','27330308','27325483','27324313','27323851','27314913','27312099','27304613','27304608','27298311','27297445','27294132','27288077','27286797','27281940','27278519','27262996','27262149','27261081','27256374','27253692','27251756','27249715','27231756','27225481','27225222','27223671','27190629','27185858','27184224','27178315','27175912','27170750','27170523','27170161','27169593','27166379','27166258','27157615','27145382','27141377','27116977','27098427','27073883','27072237','27057463','27056322','27049073','27044098','27044097','27034383','27032303','27029942','27022405','27017608','27013192','27001570','27001312','26984745','26984213','26983831','26977157','26976976','26968205','26967393','26948355','26948354','26945884','26936504','26902800','26891975','26881264','26880961','26863490','26862770','26855087','26841651','26837514','26833422','26805963','26771840','26770324','26769142','26755653','26749234','26739692','26725885','26725094','26718201','28373814','26713745','26711578','26708701','26704632','26694143','26670466','26666269','26662551','26658052','26655275','26654773','26650233','26646311','26646075','26645886','26636389','26634108','26631269','26622867','26620211','26611605','26598957','26597758','26586398','26559389','26558781','26556269','26552307','26546453','26546412','26537190','26535026','26524593','26522072','26516226','26514451','26511503','26501438','26493995','26483062','26480650','26473782','26459812','26454859','26451324','26450624','26450359','26441059','26433199','26432933','26427514','26422105','26409567','26405578','26405194','26403437','26402401','26385614','26377689','26376741','26352148','26351148','26345937','26345383','26340347','26338910','26330563','26323609','26321082','26318301','26317899','26316012','26313662','26312868','26308501','26291724','26284406','26284196','26269187','26266810','26264894','26260659','26234504','26224516','26224161','26217588','26216710','26180083','26174883','26167495','26164401','26157361','26155832','26155415','26154941','26149494','26146488','26145723','26142501','26137402','26125449','26093618','26092774','26083317','26073722','26070552','26060905','26045979','26037466','26026061','26022928','26008966','25988678','25986346','25979541','25978454','25971300','25962344','25957892','25955428','25955158','25952672','25950799','25944688','25941622','25934338','25933216','25931051','25903722','25901754','25901196','25877510','25865468','25841215','25829396','25820321','25818172','25806119','25803850','25802036','25793261','25792805','25785641','25784614','25762141','25749875','25748928','25746089','25744203','25740784','25738409','25736961','25735009','25724916','25710480','25704851','25702101','25700834','25697584','25682090','25680514','25677907','25676710','25667438','25663937','25661068','25642990','25625931','25623399','25604093','25598973','25594203','25592150','25591911','25586468','25579983','25579379','25577401','25576146','25575816','25562639','25555220','25549333','25537043','25537019','25520293','25491947','25490390','25477239','25468230','25465288','25464980','25463282','25453365','25450678','25450457','25435164','25420581','25419715','25419577','25419530','25418012','25411122','25398845'");
	 private String list1011 = new String("'28650441','28641579','28630875','28629398','28620836','28612394','28608950','28608355','28605477','28602979','28596941','28594935','28573184','28570014','28566332','28549626','28547002','28541444','28536012','28534507','28531337','28529561','28529551','28524099','28512646','28507806','28506076','28497804','28490949','28488122','28482428','28480325','28478595','28476779','28476618','28475775','28465358','28461570','28461156','28459461','28453746','28447277','28445977','28442918','28441372','28434112','28418388','28415577','28411277','28410300','28403532','28389997','28388955','28388425','28388423','28387849','28387831','28387596','28381315','28371827','28367602','28362548','28357913','28352319','28349351','28347245','28346426','28341197','28339582','28319049','28319047','28318896','28318492','28317871','28316990','28303490','28302022','28299344','28292436','28287634','28286975','28284350','28283885','28283580','28278424','28274139','28258696','28258545','28234621','28233371','28230277','28208677','28197373','28194092','28184256','28179106','28173797','28169355','28153049','20301355','28135256','28129117','28123880','28116121','28115470','28111040','28109979','28109751','28107450','28101577','28093702','28089910','28089821','28076333','28073370','28063055','28030801','28029927','28025034','28019039','28017775','28011470','28003994','28002799','28001089','28000537','28000534','27999734','27995487','27993092','27989218','27964820','27960088','27959794','27942918','27942839','27934069','27903982','27879135','27876012','27875627','27867916','27858578','27835870','27835581','27831762','27824081','27822377','27816892','27814616','27777083','27792139','27783195','27781030','27666391','27765835','27756892','27618552','27576783','27472224','27748906','27743144','27738332','27737869','27713134','27698917','27697289','27688162','27663389','27660268','27631626','27622606','27598146','27593826','27584058','27579489','27577073','27573705','27565396','27562399','27560502','27546018','27528363','27528361','27515027','27510663','27502180','27493076','27485481','27485078','27482758','27472461','27471637','27463676','27460064','27453950','27450763','27434205','27427982','27415034','27399534','27397086','27379831','27374287','27370400','27358487','27356688','27356059','27334978','27330308','27325483','27324313','27323851','27314913','27312099','27304613','27304608','27298311','27297445','27294132','27288077','27286797','27281940','27278519','27262996','27262149','27261081','27256374','27253692','27251756','27249715','27231756','27225481','27225222','27223671','27190629','27185858','27184224','27178315','27175912','27170750','27170523','27170161','27169593','27166379','27166258','27157615','27145382','27141377','27116977','27098427','27073883','27072237','27057463','27056322','27049073','27044098','27044097','27034383','27032303','27029942','27022405','27017608','27013192','27001570','27001312','26984745','26984213','26983831','26977157','26976976','26968205','26967393','26948355','26948354','26945884','26936504','26902800','26891975','26881264','26880961','26863490','26862770','26855087','26841651','26837514','26833422','26805963','26771840','26770324','26769142','26755653','26749234','26739692','26725885','26725094','26718201','28373814','26713745','26711578','26708701','26704632','26694143','26670466','26666269','26662551','26658052','26655275','26654773','26650233','26646311','26646075','26645886','26636389','26634108','26631269','26622867','26620211','26611605','26598957','26597758','26586398','26559389','26558781','26556269','26552307','26546453','26546412','26537190','26535026','26524593','26522072','26516226','26514451','26511503','26501438','26493995','26483062','26480650','26473782','26459812','26454859','26451324','26450624','26450359','26441059','26433199','26432933','26427514','26422105','26409567','26405578','26405194','26403437','26402401','26385614','26377689','26376741','26352148','26351148','26345937','26345383','26340347','26338910','26330563','26323609','26321082','26318301','26317899','26316012','26313662','26312868','26308501','26291724','26284406','26284196','26269187','26266810','26264894','26260659','26234504','26224516','26224161','26217588','26216710','26180083','26174883','26167495','26164401','26157361','26155832','26155415','26154941','26149494','26146488','26145723','26142501','26137402','26125449','26093618','26092774','26083317','26073722','26070552','26060905','26045979','26037466','26026061','26022928','26008966','25988678','25986346','25979541','25978454','25971300','25962344','25957892','25955428','25955158','25952672','25950799','25944688','25941622','25934338','25933216','25931051','25903722','25901754','25901196','25877510','25865468','25841215','25829396','25820321','25818172','25806119','25803850','25802036','25793261','25792805','25785641','25784614','25762141','25749875','25748928','25746089','25744203','25740784','25738409','25736961','25735009','25724916','25710480','25704851','25702101','25700834','25697584','25682090','25680514','25677907','25676710','25667438','25663937','25661068','25642990','25625931','25623399','25604093','25598973','25594203','25592150','25591911','25586468','25579983','25579379','25577401','25576146','25575816','25562639','25555220','25549333','25537043','25537019','25520293','25491947','25490390','25477239','25468230','25465288','25464980','25463282','25453365','25450678','25450457','25435164','25420581','25419715','25419577','25419530','25418012'");
	
	 @Override
	public void init() throws ServletException  {
		try {
			Context ctx = new InitialContext();
	        ds =
	            (DataSource)ctx.lookup("java:comp/env/jdbc/SemMedDB");
			log.debug("SemMedDBServlet initialized.");
			// s = con.createStatement();
			/* String dbquery = qryTemp.replace("$1", "\'1001\'");
			ResultSet rs = s.executeQuery(dbquery);
			log.debug("result set obtained");
			while (rs.next()){
				log.debug(rs.getString("PMID") + ", " + rs.getString("predicate"));
			} */
		} catch(NamingException ne) {
			ne.printStackTrace();
		}
	}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		// log.debug("Getting request from SemMed2");
		doPost(req,resp);
	}

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		Connection con = null;
		Statement s = null;
		ResultSet rs = null;
		try {
			log.debug("Getting request from SemMed2");
			// Statement s = con.createStatement();
			String ping =  req.getParameter("ping");
			if(ping != null) {
				log.debug("Getting ping request;");
				return;
			}
			String qry = req.getParameter("qry");
			String pmids = req.getParameter("PMIDs");
			String sids = req.getParameter("SIDs");
			String logout = req.getParameter("logout");
			log.debug("qry = " + qry);
			log.debug("PMIDs = " + pmids);
			log.debug("SIDs = " + sids);
			log.debug("logout = " + logout); 

			if(qry != null && !qry.equals("")) {
				con = ds.getConnection();
				s = con.createStatement();
				String dbquery = null;
				if(qry.equals(new String("1010")))
						dbquery = qryTemp.replace("$1", list1010);
				else if(qry.equals(new String("1011")))
					dbquery = qryTemp.replace("$1", list1011);

				rs = s.executeQuery(dbquery);
				JSONArray result = new JSONArray();
				 ArrayList<Predication> predArray = new ArrayList<Predication>();  
				while (rs.next()){
                    Predication apred = new Predication();
                    apred.PREDICATION_ID = rs.getInt(1);
                    apred.SENTENCE_ID = rs.getInt(2);
                    apred.PMID = rs.getString(3);
                    apred.PREDICATE = rs.getString(4);
                    String temp_scui = rs.getString(5);
                    if (temp_scui.contains((CharSequence)"|")) {
                        if (temp_scui.startsWith("C")) {
                            // log.debug((Object)("prev SUBJECT_CUI = " + temp_scui));
                            String[] compo1 = temp_scui.split("\\|");
                            apred.SUBJECT_CUI = compo1[0];
                            // log.debug((Object)("cur SUBJECT_CUI = " + apred.SUBJECT_CUI));
                            String[] compo2 = rs.getString(6).split("\\|");
                            apred.SUBJECT_NAME = compo2[0];
                            String[] compo3 = rs.getString(7).split("\\|");
                            apred.SUBJECT_SEMTYPE = compo3[0];
                            apred.SUBJECT_NOVELTY = rs.getString(8);
                        } else {
                            // log.debug((Object)("prev SUBJECT_CUI = " + temp_scui));
                            apred.SUBJECT_CUI = temp_scui.replaceAll("\\|", ",");
                            // log.debug((Object)("cur SUBJECT_CUI = " + apred.SUBJECT_CUI));
                            String temp_sname = rs.getString(6);
                            apred.SUBJECT_NAME = temp_sname.replaceAll("\\|", ",");
                            String temp_stype = rs.getString(7);
                            apred.SUBJECT_SEMTYPE = temp_stype.replaceAll("\\|", ",");
                            apred.SUBJECT_NOVELTY = rs.getString(8);
                        }
                    } else {
                        apred.SUBJECT_CUI = rs.getString(5);
                        apred.SUBJECT_NAME = rs.getString(6);
                        apred.SUBJECT_SEMTYPE = rs.getString(7);
                        apred.SUBJECT_NOVELTY = rs.getString(8);
                    }
                    String temp_ocui = rs.getString(9);
                    if (temp_ocui.contains((CharSequence)"|")) {
                        if (temp_ocui.startsWith("C")) {
                            // log.debug((Object)("prev OBJECT_CUI = " + temp_ocui));
                            String[] compo1 = temp_ocui.split("\\|");
                            apred.OBJECT_CUI = compo1[0];
                            // log.debug((Object)("cur OBJECT_CUI = " + apred.OBJECT_CUI));
                            String[] compo2 = rs.getString(10).split("\\|");
                            apred.OBJECT_NAME = compo2[0];
                            String[] compo3 = rs.getString(11).split("\\|");
                            apred.OBJECT_SEMTYPE = compo3[0];
                            apred.OBJECT_NOVELTY = rs.getString(12);
                        } else {
                            // log.debug((Object)("prev OBJECT_CUI = " + temp_ocui));
                            apred.OBJECT_CUI = temp_ocui.replaceAll("\\|", ",");
                            // log.debug((Object)("cur OBJECT_CUI = " + apred.OBJECT_CUI));
                            String temp_oname = rs.getString(10);
                            apred.OBJECT_NAME = temp_oname.replaceAll("\\|", ",");
                            String temp_otype = rs.getString(11);
                            apred.OBJECT_SEMTYPE = temp_otype.replaceAll("\\|", ",");
                            apred.OBJECT_NOVELTY = rs.getString(12);
                        }
                    } else {
                        apred.OBJECT_CUI = rs.getString(9);
                        apred.OBJECT_NAME = rs.getString(10);
                        apred.OBJECT_SEMTYPE = rs.getString(11);
                        apred.OBJECT_NOVELTY = rs.getString(12);
                    }
                    predArray.add(apred);
                }
                for (int i = 0; i < predArray.size(); ++i) {
                    JSONArray ja = new JSONArray();
                    Predication apred = (Predication)predArray.get(i);
                    ja.put((Object)((Integer) apred.PREDICATION_ID).toString());
                    ja.put((Object)((Integer) apred.SENTENCE_ID).toString());
                    ja.put((Object)apred.PMID);
                    ja.put((Object)apred.PREDICATE);
                    ja.put((Object)apred.SUBJECT_CUI);
                    ja.put((Object)apred.SUBJECT_NAME);
                    ja.put((Object)apred.SUBJECT_SEMTYPE);
                    ja.put((Object)apred.SUBJECT_NOVELTY);
                    ja.put((Object)apred.OBJECT_CUI);
                    ja.put((Object)apred.OBJECT_NAME);
                    ja.put((Object)apred.OBJECT_SEMTYPE);
                    ja.put((Object)apred.OBJECT_NOVELTY); 
                    result.put((Object)ja);
                    log.debug((Object)ja.toString());
                }
				// log.debug("select operation completed");
				s.close();
				rs.close();
				resp.setContentType("text/plain");
				ServletOutputStream outStream = resp.getOutputStream();
				outStream.print(result.toString());
			} else if(pmids != null && !pmids.equals("")) {
				if(pmids.endsWith(",")) {
					// log.debug("*** odd pmids = " + pmids);
					pmids = pmids.substring(0, pmids.length()-1);
				}
				String dbquery = qry2Temp.replace("$1", pmids);
				// log.debug("dbquery = " + dbquery);
				con = ds.getConnection();
				s = con.createStatement();
				rs = s.executeQuery(dbquery);
				JSONArray result = new JSONArray();
				while (rs.next()){
					String[] aRow = new String[5];
					JSONArray ja = new JSONArray();
					ja.put(rs.getString(1));
					ja.put(rs.getString(2));
					ja.put(rs.getString(3));
					ja.put(rs.getString(4));
					ja.put(rs.getString(5));
					result.put(ja);
					// log.debug(ja.toString());
				}
				log.debug("send JSON data back to client");
				s.close();
				rs.close();
				resp.setContentType("text/plain");
				ServletOutputStream outStream = resp.getOutputStream();
				outStream.print(result.toString());
			} else if(sids != null && !sids.equals("")) {
				if(sids.endsWith(",")) {
					log.debug("*** odd sids = " + sids);
					sids = sids.substring(0, sids.length()-1);
				}
				String dbquery = qry3Temp.replace("$1", sids);
				// log.debug("dbquery = " + dbquery);
				con = ds.getConnection();
				s = con.createStatement();
				rs = s.executeQuery(dbquery);
				JSONArray result = new JSONArray();
				while (rs.next()){
					String[] aRow = new String[5];
					JSONArray ja = new JSONArray();
					ja.put(rs.getString(1));
					ja.put(rs.getString(2));
					ja.put(rs.getString(3));
					ja.put(rs.getString(4));
					ja.put(rs.getString(5));
					result.put(ja);
					// log.debug(ja.toString());
				}
				// log.debug("select operation completed");
				s.close();
				rs.close();
				resp.setContentType("text/plain");
				ServletOutputStream outStream = resp.getOutputStream();
				outStream.print(result.toString());
			} else if(logout  != null && !logout.equals("") ) {
				log.debug("get cookie info");
				Cookie[] cookies = req.getCookies();
				HttpSession session = req.getSession();
				session.invalidate();
		        for(int i = 0; i< cookies.length ; ++i){
		        	log.debug("Cookie name = " + cookies[i].getName());
		        	if(cookies[i].getName().trim().compareTo("JSESSIONID") == 0){		            
		        		log.debug("Found Cookie name = " + cookies[i].getName());
		                //response.addCookie(cookie);
		        		cookies[i].setValue(null);
		                cookies[i].setMaxAge(0);
		                resp.addCookie(cookies[i]);
		            }
		        } 
				RequestDispatcher rd = req.getRequestDispatcher("logout.html");
				rd.forward(req, resp);
			}
			// log.debug(result.toString());

		} catch(Exception e) {
			e.printStackTrace();
		}
			finally {
	        if (rs != null) try { rs.close(); } catch (SQLException ignore) {}
	        if (s != null) try { s.close(); } catch (SQLException ignore) {}
	        if (con != null) try { con.close(); } catch (SQLException ignore) {}
	    }
	}
	
	class Predication {
	    int PREDICATION_ID;
	    int SENTENCE_ID;
	    String PMID;
	    String SUBJECT_CUI;
	    String SUBJECT_NAME;
	    String SUBJECT_SEMTYPE;
	    String SUBJECT_NOVELTY;
	    String PREDICATE;
	    String OBJECT_CUI;
	    String OBJECT_NAME;
	    String OBJECT_SEMTYPE;
	    String OBJECT_NOVELTY;

	    Predication() {
	    }
	}

}

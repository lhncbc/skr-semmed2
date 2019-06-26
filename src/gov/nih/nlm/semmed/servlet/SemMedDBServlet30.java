package gov.nih.nlm.semmed.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;

/**
 *
 * @author shindongwoo
 *
 */
public class SemMedDBServlet30 extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static Log log = LogFactory.getLog(SemMedDBServlet30.class);

    private DataSource ds;

    private String qryTemp = new String(
	    "select PREDICATION_ID, SENTENCE_ID, PMID, PREDICATE, SUBJECT_CUI, SUBJECT_NAME, SUBJECT_SEMTYPE, SUBJECT_NOVELTY, OBJECT_CUI, OBJECT_NAME, OBJECT_SEMTYPE, OBJECT_NOVELTY from PREDICATION where PMID in ($1) limit 50000");
    private String qry2Temp = new String("select * from SENTENCE where PMID in ($1) order by PMID, TYPE desc, NUMBER");
    private String qry3Temp = new String("select * from SENTENCE where SENTENCE_ID in ($1) order by PMID, NUMBER");

    @Override
    public void init() throws ServletException {
	try {
	    Context ctx = new InitialContext();
	    ds = (DataSource) ctx.lookup("java:comp/env/jdbc/SemMedDB");
	    log.debug("SemMedDBServlet initialized.");
	    // s = con.createStatement();
	    /*
	     * String dbquery = qryTemp.replace("$1", "\'1001\'"); ResultSet rs =
	     * s.executeQuery(dbquery); log.debug("result set obtained"); while (rs.next()){
	     * log.debug(rs.getString("PMID") + ", " + rs.getString("predicate")); }
	     */
	} catch (NamingException ne) {
	    ne.printStackTrace();
	}
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
	// log.debug("Getting request from SemMed2");
	doPost(req, resp);
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
	Connection con = null;
	Statement s = null;
	ResultSet rs = null;
	try {
	    log.debug("Getting request from SemMed2");
	    // Statement s = con.createStatement();
	    String ping = req.getParameter("ping");
	    if (ping != null) {
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

	    if (qry != null && !qry.equals("")) {
		con = ds.getConnection();
		s = con.createStatement();
		String dbquery = qryTemp.replace("$1", qry);

		rs = s.executeQuery(dbquery);
		JSONArray result = new JSONArray();
		ArrayList<Predication> predArray = new ArrayList<>();
		while (rs.next()) {
		    Predication apred = new Predication();
		    apred.PREDICATION_ID = rs.getInt(1);
		    apred.SENTENCE_ID = rs.getInt(2);
		    apred.PMID = rs.getString(3);
		    apred.PREDICATE = rs.getString(4);
		    String temp_scui = rs.getString(5);
		    if (temp_scui.contains("|")) {
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
		    if (temp_ocui.contains("|")) {
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
		    Predication apred = predArray.get(i);
		    ja.put(((Integer) apred.PREDICATION_ID).toString());
		    ja.put(((Integer) apred.SENTENCE_ID).toString());
		    ja.put(apred.PMID);
		    ja.put(apred.PREDICATE);
		    ja.put(apred.SUBJECT_CUI);
		    ja.put(apred.SUBJECT_NAME);
		    ja.put(apred.SUBJECT_SEMTYPE);
		    ja.put(apred.SUBJECT_NOVELTY);
		    ja.put(apred.OBJECT_CUI);
		    ja.put(apred.OBJECT_NAME);
		    ja.put(apred.OBJECT_SEMTYPE);
		    ja.put(apred.OBJECT_NOVELTY);
		    result.put(ja);
		    log.debug(ja.toString());
		}
		// log.debug("select operation completed");
		s.close();
		rs.close();
		resp.setContentType("text/plain");
		ServletOutputStream outStream = resp.getOutputStream();
		outStream.print(result.toString());
	    } else if (pmids != null && !pmids.equals("")) {
		if (pmids.endsWith(",")) {
		    // log.debug("*** odd pmids = " + pmids);
		    pmids = pmids.substring(0, pmids.length() - 1);
		}
		String dbquery = qry2Temp.replace("$1", pmids);
		// log.debug("dbquery = " + dbquery);
		con = ds.getConnection();
		s = con.createStatement();
		rs = s.executeQuery(dbquery);
		JSONArray result = new JSONArray();
		while (rs.next()) {
		    String[] aRow = new String[5];
		    JSONArray ja = new JSONArray();
		    ja.put(rs.getString(1));
		    ja.put(rs.getString(2));
		    ja.put(rs.getString(3));
		    ja.put(rs.getString(4));
		    ja.put(rs.getString(6));
		    result.put(ja);
		    // log.debug(ja.toString());
		}
		log.debug("send JSON data back to client");
		s.close();
		rs.close();
		resp.setContentType("text/plain");
		ServletOutputStream outStream = resp.getOutputStream();
		outStream.print(result.toString());
	    } else if (sids != null && !sids.equals("")) {
		if (sids.endsWith(",")) {
		    log.debug("*** odd sids = " + sids);
		    sids = sids.substring(0, sids.length() - 1);
		}
		String dbquery = qry3Temp.replace("$1", sids);
		// log.debug("dbquery = " + dbquery);
		con = ds.getConnection();
		s = con.createStatement();
		rs = s.executeQuery(dbquery);
		JSONArray result = new JSONArray();
		while (rs.next()) {
		    String[] aRow = new String[5];
		    JSONArray ja = new JSONArray();
		    ja.put(rs.getString(1));
		    ja.put(rs.getString(2));
		    ja.put(rs.getString(3));
		    ja.put(rs.getString(4));
		    ja.put(rs.getString(6));
		    result.put(ja);
		    // log.debug(ja.toString());
		}
		// log.debug("select operation completed");
		s.close();
		rs.close();
		resp.setContentType("text/plain");
		ServletOutputStream outStream = resp.getOutputStream();
		outStream.print(result.toString());
	    } else if (logout != null && !logout.equals("")) {
		log.debug("get cookie info");
		Cookie[] cookies = req.getCookies();
		HttpSession session = req.getSession();
		session.invalidate();
		for (int i = 0; i < cookies.length; ++i) {
		    log.debug("Cookie name = " + cookies[i].getName());
		    if (cookies[i].getName().trim().compareTo("JSESSIONID") == 0) {
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

	} catch (Exception e) {
	    e.printStackTrace();
	} finally {
	    if (rs != null)
		try {
		    rs.close();
		} catch (SQLException ignore) {
		}
	    if (s != null)
		try {
		    s.close();
		} catch (SQLException ignore) {
		}
	    if (con != null)
		try {
		    con.close();
		} catch (SQLException ignore) {
		}
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

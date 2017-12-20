package edu.upc.pes.agora.Presentation;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import edu.upc.pes.agora.Logic.Adapters.ProposalAdapter;
import edu.upc.pes.agora.Logic.Adapters.RecyclerAdapter;
import edu.upc.pes.agora.Logic.Models.Proposal;
import edu.upc.pes.agora.Logic.ServerConection.GetTokenAsyncTask;
import edu.upc.pes.agora.Logic.Utils.Constants;
import edu.upc.pes.agora.R;

public class OtherUserProposalsActivity extends AppCompatActivity {

    private ListView propList;
    private JSONObject Jason = new JSONObject();
    private ArrayList<Proposal> propostes;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_other_user_proposals);

        propList = (ListView) findViewById(R.id.propList);
        String user = getIntent().getStringExtra("username");

        new GetTokenAsyncTask("https://agora-pes.herokuapp.com/api/proposal?username=" + user, this) {

            @Override
            protected void onPostExecute(JSONObject jsonObject) {
                try {
                    if (jsonObject.has("error")) {
                        String error = jsonObject.get("error").toString();
                        Log.i("asd123", "Error");

                        Toast toast = Toast.makeText(getApplicationContext(), error, Toast.LENGTH_SHORT);
                        toast.show();
                    }

                    else if (jsonObject != null){
                        JSONArray ArrayProp = jsonObject.getJSONArray("arrayResponse");
                        propostes = new ArrayList<>();

                        if (ArrayProp != null) {
                            for (int i=0; i < ArrayProp.length(); i++){

                                Log.i("asd123", (ArrayProp.get(i).toString()));

                                JSONObject jas = ArrayProp.getJSONObject(i);
                                String title = jas.getString("title");
                                String owner = jas.getString("owner");
                                String description = jas.getString("content");
                                Integer id = jas.getInt("id");
                                String ca = jas.getString("categoria");

                                Proposal aux = new Proposal(id, title, description, owner, ca);

                                propostes.add(aux);
                            }
                        }
                        propList.setAdapter(new ProposalAdapter(propostes, getApplicationContext()));
                    }
                } catch (JSONException e ) {
                    e.printStackTrace();
                }
            }
        }.execute(Jason);
    }
}
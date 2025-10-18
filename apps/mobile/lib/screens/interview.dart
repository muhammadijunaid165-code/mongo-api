import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:web_socket_channel/web_socket_channel.dart';

class InterviewScreen extends StatefulWidget {
  const InterviewScreen({super.key});

  @override
  State<InterviewScreen> createState() => _InterviewScreenState();
}

class _InterviewScreenState extends State<InterviewScreen> {
  String? interviewId;
  List<String> questions = [];
  int index = 0;
  int remaining = 60;
  final controller = TextEditingController();
  WebSocketChannel? channel;
  Timer? timer;
  DateTime start = DateTime.now();

  Future<void> startInterview() async {
    final token = await const FlutterSecureStorage().read(key: 'token');
    final jobId = await _prompt(context, 'Enter Job ID');
    final resp = await http.post(Uri.parse('http://localhost:5000/api/interviews/start'),
      headers: {'Content-Type':'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode({'jobId': jobId})
    );
    final data = jsonDecode(resp.body);
    setState((){ interviewId = data['interviewId']; questions = List<String>.from(data['questions']); index = 0; remaining = 60; });

    channel = WebSocketChannel.connect(Uri.parse('ws://localhost:5000'));
    channel!.sink.add(jsonEncode({'type':'interview:join','id': interviewId}));

    start = DateTime.now();
    timer?.cancel();
    timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState((){ remaining = remaining-1; });
      if (remaining <= 0) nextQuestion(true);
    });
  }

  Future<void> submit() async {
    final token = await const FlutterSecureStorage().read(key: 'token');
    final elapsed = DateTime.now().difference(start).inSeconds;
    await http.post(Uri.parse('http://localhost:5000/api/interviews/${interviewId}/submit'),
      headers: {'Content-Type':'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode({'answers':[{'question': questions[index], 'answer': controller.text, 'timeTakenSec': elapsed}]})
    );
    nextQuestion(false);
  }

  void nextQuestion(bool auto){
    setState((){ index += 1; controller.clear(); remaining = 60; start = DateTime.now(); });
    if (index >= questions.length) { timer?.cancel(); _dialog(context, 'Interview complete'); }
  }

  @override
  void dispose(){
    timer?.cancel();
    channel?.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Secure Interview')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children:[
            const Text('Answer the question', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            Text('⏳ ${remaining}s', style: const TextStyle(fontFamily: 'monospace'))
          ]),
          const SizedBox(height: 12),
          if (interviewId == null)
            ElevatedButton(onPressed: startInterview, child: const Text('Start'))
          else ...[
            Text('Q${index+1}. ${questions[index]}'),
            const SizedBox(height: 8),
            TextField(controller: controller, maxLines: 6, decoration: const InputDecoration(border: OutlineInputBorder())),
            const SizedBox(height: 8),
            Row(children:[
              ElevatedButton(onPressed: submit, child: const Text('Submit')),
            ])
          ]
        ]),
      ),
    );
  }
}

Future<String?> _prompt(BuildContext context, String title) async {
  final c = TextEditingController();
  return showDialog<String>(context: context, builder: (_){
    return AlertDialog(title: Text(title), content: TextField(controller: c), actions: [
      TextButton(onPressed: ()=> Navigator.pop(context), child: const Text('Cancel')),
      TextButton(onPressed: ()=> Navigator.pop(context, c.text), child: const Text('OK')),
    ]);
  });
}

void _dialog(BuildContext context, String msg){
  showDialog(context: context, builder: (_)=> AlertDialog(title: const Text('Info'), content: Text(msg), actions: [TextButton(onPressed: ()=> Navigator.pop(context), child: const Text('OK'))]));
}

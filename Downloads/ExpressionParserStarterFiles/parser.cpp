/*
 * parser.cpp
 *
 * Implementation of parser.h
 *
 * See parser.h for a full BNF of the grammar to implement.
 *
 * You should implement the different Find( ) functions,
 * as well as any additional functions you declare in parser.h.
 */

#include "expression.h"
#include "parser.h"

Expression *Parser::FindFactor( )
   {
   
   bool isNegative = stream.Match('-');

 
   if (Number *num = stream.ParseNumber()) {
      if (isNegative) {
         int64_t val = num->Eval();
         delete num;
         return new Number(-val);
      }
      return num;
   }

   
   if (isNegative) {
      return nullptr;
   }


   if (stream.Match('(')) {
      Expression *expr = FindAdd();
      if (!expr || !stream.Match(')')) {
         delete expr;
         return nullptr;
      }
      return expr;
   }

   return nullptr;
   }

Expression *Parser::FindMultiply( )
   {
   Expression *left = FindFactor();
   if (!left) {
      return nullptr;
   }

 
   while (stream.Match('*')) {
      Expression *right = FindFactor();
      if (!right) {
         delete left;
         return nullptr;
      }
      Expression *mult = new Multiply(left, right);
      left = mult;
   }

   return left;
   }

Expression *Parser::FindAdd( )
   {
   Expression *left = FindMultiply();
   if (!left) {
      return nullptr;
   }

   while (stream.Match('+')) {
      Expression *right = FindMultiply();
     
      if (!right) {
         delete left;
         return nullptr;
      }
      Expression *add = new Add(left, right);
      left = add;
   }

   return left;
   }

Expression *Parser::Parse( )
   {
   Expression *expr = FindAdd();
   if (!expr || !stream.AllConsumed()) {
      delete expr;
      return nullptr;
   }
   return expr;
   }

Parser::Parser( const std::string &in ) :
      stream( in )
   {
   }
